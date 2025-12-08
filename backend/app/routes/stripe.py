"""
Stripe webhook routes for handling subscription events
"""
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.webhook_service import WebhookService
from app.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Stripe"])


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Handle Stripe webhook events
    This endpoint should be configured in Stripe Dashboard
    """
    try:
        import stripe
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="Stripe library not installed"
        )
    
    # Get webhook secret from environment
    webhook_secret = settings.STRIPE_SECRET_KEY  # In production, use STRIPE_WEBHOOK_SECRET
    if not webhook_secret:
        logger.warning("Stripe webhook secret not configured")
        raise HTTPException(
            status_code=500,
            detail="Webhook secret not configured"
        )
    
    # Get the raw request body and signature
    payload = await request.body()
    signature = request.headers.get("stripe-signature")
    
    if not signature:
        raise HTTPException(
            status_code=400,
            detail="Missing stripe-signature header"
        )
    
    # Verify webhook signature
    try:
        event = stripe.Webhook.construct_event(
            payload,
            signature,
            webhook_secret
        )
    except ValueError as e:
        logger.error(f"Invalid webhook payload: {e}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid webhook signature: {e}")
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Process the event
    event_type = event.get("type")
    event_data = event.get("data", {})
    
    logger.info(f"Processing Stripe webhook event: {event_type}")
    
    success = WebhookService.process_webhook_event(
        event_type,
        event_data,
        db
    )
    
    if success:
        return {"status": "success", "event": event_type}
    else:
        # Still return 200 to prevent Stripe from retrying
        # Log the error for investigation
        logger.warning(f"Webhook event {event_type} processed but returned False")
        return {"status": "processed", "event": event_type}


@router.get("/webhook/test")
def test_webhook():
    """Test endpoint to verify webhook route is accessible"""
    return {
        "message": "Stripe webhook endpoint is active",
        "configured": bool(settings.STRIPE_SECRET_KEY)
    }


@router.post("/create-setup-intent")
async def create_setup_intent(
    customer_id: str = None,
    db: Session = Depends(get_db)
):
    """
    Create a SetupIntent for collecting payment method
    Used during signup to securely collect card details via Stripe Elements
    """
    try:
        from app.services.stripe_service import StripeService
        
        setup_intent = StripeService.create_setup_intent(customer_id=customer_id)
        return {
            "client_secret": setup_intent["client_secret"],
            "setup_intent_id": setup_intent["id"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create setup intent: {str(e)}"
        )

