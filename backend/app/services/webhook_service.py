"""
Stripe webhook service for processing subscription events
"""
import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.config import settings

logger = logging.getLogger(__name__)


class WebhookService:
    """Service for processing Stripe webhooks"""
    
    @staticmethod
    def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
        """
        Verify Stripe webhook signature
        Returns True if signature is valid
        """
        try:
            import stripe
            stripe.Webhook.construct_event(
                payload,
                signature,
                secret
            )
            return True
        except ValueError as e:
            logger.error(f"Invalid webhook payload: {e}")
            return False
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Invalid webhook signature: {e}")
            return False
        except Exception as e:
            logger.error(f"Error verifying webhook: {e}")
            return False
    
    @staticmethod
    def process_subscription_created(event_data: dict, db: Session) -> bool:
        """Process customer.subscription.created event"""
        try:
            subscription = event_data.get("object", {})
            customer_id = subscription.get("customer")
            
            if not customer_id:
                logger.warning("No customer ID in subscription.created event")
                return False
            
            user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
            if not user:
                logger.warning(f"User not found for customer {customer_id}")
                return False
            
            # Update subscription status
            status = subscription.get("status", "active")
            if status == "trialing":
                user.subscription_status = "trial"
            elif status == "active":
                user.subscription_status = "active"
            
            db.commit()
            logger.info(f"Updated subscription status for user {user.id} to {user.subscription_status}")
            return True
            
        except Exception as e:
            logger.error(f"Error processing subscription.created: {e}")
            db.rollback()
            return False
    
    @staticmethod
    def process_subscription_updated(event_data: dict, db: Session) -> bool:
        """Process customer.subscription.updated event"""
        try:
            subscription = event_data.get("object", {})
            customer_id = subscription.get("customer")
            
            if not customer_id:
                logger.warning("No customer ID in subscription.updated event")
                return False
            
            user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
            if not user:
                logger.warning(f"User not found for customer {customer_id}")
                return False
            
            # Update subscription status based on Stripe status
            status = subscription.get("status", "")
            if status == "active":
                user.subscription_status = "active"
            elif status == "trialing":
                user.subscription_status = "trial"
            elif status == "past_due":
                user.subscription_status = "active"  # Still active but payment failed
            elif status == "canceled" or status == "unpaid":
                user.subscription_status = "cancelled"
            elif status == "incomplete" or status == "incomplete_expired":
                user.subscription_status = "expired"
            
            db.commit()
            logger.info(f"Updated subscription status for user {user.id} to {user.subscription_status}")
            return True
            
        except Exception as e:
            logger.error(f"Error processing subscription.updated: {e}")
            db.rollback()
            return False
    
    @staticmethod
    def process_subscription_deleted(event_data: dict, db: Session) -> bool:
        """Process customer.subscription.deleted event"""
        try:
            subscription = event_data.get("object", {})
            customer_id = subscription.get("customer")
            
            if not customer_id:
                logger.warning("No customer ID in subscription.deleted event")
                return False
            
            user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
            if not user:
                logger.warning(f"User not found for customer {customer_id}")
                return False
            
            user.subscription_status = "cancelled"
            db.commit()
            logger.info(f"Marked subscription as cancelled for user {user.id}")
            return True
            
        except Exception as e:
            logger.error(f"Error processing subscription.deleted: {e}")
            db.rollback()
            return False
    
    @staticmethod
    def process_invoice_payment_succeeded(event_data: dict, db: Session) -> bool:
        """Process invoice.payment_succeeded event"""
        try:
            invoice = event_data.get("object", {})
            customer_id = invoice.get("customer")
            subscription_id = invoice.get("subscription")
            
            if not customer_id:
                logger.warning("No customer ID in invoice.payment_succeeded event")
                return False
            
            user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
            if not user:
                logger.warning(f"User not found for customer {customer_id}")
                return False
            
            # Payment succeeded, ensure subscription is active
            if subscription_id:
                user.subscription_status = "active"
                db.commit()
                logger.info(f"Marked subscription as active for user {user.id} after successful payment")
            
            return True
            
        except Exception as e:
            logger.error(f"Error processing invoice.payment_succeeded: {e}")
            db.rollback()
            return False
    
    @staticmethod
    def process_invoice_payment_failed(event_data: dict, db: Session) -> bool:
        """Process invoice.payment_failed event"""
        try:
            invoice = event_data.get("object", {})
            customer_id = invoice.get("customer")
            
            if not customer_id:
                logger.warning("No customer ID in invoice.payment_failed event")
                return False
            
            user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
            if not user:
                logger.warning(f"User not found for customer {customer_id}")
                return False
            
            # Payment failed - could send notification here
            # Don't change subscription status immediately (Stripe will handle retries)
            logger.warning(f"Payment failed for user {user.id} (customer {customer_id})")
            
            return True
            
        except Exception as e:
            logger.error(f"Error processing invoice.payment_failed: {e}")
            return False
    
    @staticmethod
    def process_webhook_event(event_type: str, event_data: dict, db: Session) -> bool:
        """
        Process a webhook event based on event type
        Returns True if processed successfully
        """
        handlers = {
            "customer.subscription.created": WebhookService.process_subscription_created,
            "customer.subscription.updated": WebhookService.process_subscription_updated,
            "customer.subscription.deleted": WebhookService.process_subscription_deleted,
            "invoice.payment_succeeded": WebhookService.process_invoice_payment_succeeded,
            "invoice.payment_failed": WebhookService.process_invoice_payment_failed,
        }
        
        handler = handlers.get(event_type)
        if not handler:
            logger.info(f"Unhandled webhook event type: {event_type}")
            return False
        
        return handler(event_data, db)

