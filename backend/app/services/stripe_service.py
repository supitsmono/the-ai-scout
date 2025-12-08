import os
from typing import Optional, Dict
from datetime import datetime, timedelta

# Optional Stripe import - only if available
try:
    import stripe
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_AVAILABLE = True
except ImportError:
    stripe = None
    STRIPE_AVAILABLE = False


class StripeService:
    """Service for handling Stripe payments and fraud detection"""
    
    @staticmethod
    def create_customer(email: str, name: str, metadata: Optional[Dict] = None) -> stripe.Customer:
        """Create a Stripe customer"""
        return stripe.Customer.create(
            email=email,
            name=name,
            metadata=metadata or {}
        )
    
    @staticmethod
    def create_payment_method(
        card_number: str,
        expiry_month: int,
        expiry_year: int,
        cvc: str,
        cardholder_name: str
    ) -> stripe.PaymentMethod:
        """Create a payment method (card)"""
        # Note: In production, use Stripe Elements on frontend for PCI compliance
        # This is just for backend validation
        return stripe.PaymentMethod.create(
            type="card",
            card={
                "number": card_number.replace(" ", ""),
                "exp_month": expiry_month,
                "exp_year": 2000 + expiry_year,  # Convert YY to YYYY
                "cvc": cvc,
            },
            billing_details={
                "name": cardholder_name,
            }
        )
    
    @staticmethod
    def attach_payment_method_to_customer(
        payment_method_id: str,
        customer_id: str
    ) -> stripe.PaymentMethod:
        """Attach payment method to customer"""
        return stripe.PaymentMethod.attach(
            payment_method_id,
            customer=customer_id
        )
    
    @staticmethod
    def check_payment_method_exists(card_last4: str, expiry_month: int, expiry_year: int) -> bool:
        """
        Check if this payment method (card) has been used before
        Note: Stripe doesn't directly support this, but you can:
        1. Store card fingerprints in your database
        2. Use Stripe Radar for fraud detection
        3. Check customer payment methods
        """
        # This is a simplified check - in production, use Stripe's fingerprint
        # or store card hashes in your database
        return False
    
    @staticmethod
    def create_subscription(
        customer_id: str,
        payment_method_id: str,
        price_id: str,
        trial_days: int = 7
    ) -> stripe.Subscription:
        """Create a subscription with trial period"""
        trial_end = int((datetime.utcnow() + timedelta(days=trial_days)).timestamp())
        
        return stripe.Subscription.create(
            customer=customer_id,
            items=[{"price": price_id}],
            default_payment_method=payment_method_id,
            trial_end=trial_end,
            collection_method="charge_automatically",
            metadata={
                "trial_days": str(trial_days),
                "trial_start": datetime.utcnow().isoformat()
            }
        )
    
    @staticmethod
    def cancel_subscription(subscription_id: str) -> stripe.Subscription:
        """Cancel a subscription"""
        return stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=True
        )
    
    @staticmethod
    def get_customer_subscriptions(customer_id: str) -> list:
        """Get all subscriptions for a customer"""
        return stripe.Subscription.list(customer=customer_id).data
    
    @staticmethod
    def check_customer_exists(email: str) -> bool:
        """Check if a Stripe customer with this email exists"""
        customers = stripe.Customer.list(email=email, limit=1)
        return len(customers.data) > 0
    
    @staticmethod
    def get_payment_method_fingerprint(payment_method_id: str) -> Optional[str]:
        """Get payment method fingerprint for duplicate detection"""
        try:
            pm = stripe.PaymentMethod.retrieve(payment_method_id)
            if pm.card:
                return pm.card.fingerprint
        except:
            pass
        return None

