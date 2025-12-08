from typing import Optional, Dict
from datetime import datetime, timedelta
from app.config import settings

# Optional Stripe import - only if available
try:
    import stripe
    if settings.STRIPE_SECRET_KEY:
        stripe.api_key = settings.STRIPE_SECRET_KEY
    STRIPE_AVAILABLE = True
except ImportError:
    stripe = None
    STRIPE_AVAILABLE = False


class StripeService:
    """Service for handling Stripe payments and fraud detection"""
    
    @staticmethod
    def create_customer(email: str, name: str, metadata: Optional[Dict] = None):
        """Create a Stripe customer"""
        if not STRIPE_AVAILABLE:
            # Mock object
            class MockCustomer:
                id = f"cus_mock_{int(datetime.utcnow().timestamp())}"
            return MockCustomer()

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
    ):
        """Create a payment method (card)"""
        if not STRIPE_AVAILABLE:
            class MockPaymentMethod:
                id = f"pm_mock_{int(datetime.utcnow().timestamp())}"
                card = type('obj', (object,), {'fingerprint': 'mock_fingerprint'})
            return MockPaymentMethod()

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
    ):
        """Attach payment method to customer"""
        if not STRIPE_AVAILABLE:
            return True

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
    ):
        """Create a subscription with trial period"""
        if not STRIPE_AVAILABLE:
            class MockSubscription:
                id = f"sub_mock_{int(datetime.utcnow().timestamp())}"
            return MockSubscription()

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
    def cancel_subscription(subscription_id: str):
        """Cancel a subscription"""
        if not STRIPE_AVAILABLE:
            return True

        return stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=True
        )
    
    @staticmethod
    def get_customer_subscriptions(customer_id: str) -> list:
        """Get all subscriptions for a customer"""
        if not STRIPE_AVAILABLE:
            return []
            
        return stripe.Subscription.list(customer=customer_id).data
    
    @staticmethod
    def check_customer_exists(email: str) -> bool:
        """Check if a Stripe customer with this email exists"""
        if not STRIPE_AVAILABLE:
            return False

        customers = stripe.Customer.list(email=email, limit=1)
        return len(customers.data) > 0
    
    @staticmethod
    def get_payment_method_fingerprint(payment_method_id: str) -> Optional[str]:
        """Get payment method fingerprint for duplicate detection"""
        if not STRIPE_AVAILABLE:
            return "mock_fingerprint_123"

        try:
            pm = stripe.PaymentMethod.retrieve(payment_method_id)
            if pm.card:
                return pm.card.fingerprint
        except:
            pass
        return None
    
    @staticmethod
    def create_setup_intent(customer_id: str = None) -> dict:
        """Create a SetupIntent for collecting payment method (for trial subscriptions)"""
        if not STRIPE_AVAILABLE:
            return {
                "client_secret": "seti_mock_secret",
                "id": f"seti_mock_{int(datetime.utcnow().timestamp())}"
            }
        
        try:
            setup_intent = stripe.SetupIntent.create(
                customer=customer_id,
                payment_method_types=["card"],
                usage="off_session"  # For future payments
            )
            return {
                "client_secret": setup_intent.client_secret,
                "id": setup_intent.id
            }
        except Exception as e:
            raise Exception(f"Failed to create setup intent: {str(e)}")

