# Setup Guide: Fraud Prevention System

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...  # Get from Stripe Dashboard
STRIPE_PUBLISHABLE_KEY=pk_test_...  # For frontend
STRIPE_PRICE_ID=price_...  # Your monthly subscription price ID

# Database (already configured)
DATABASE_URL=sqlite:///./theaiscout.db
```

### 3. Create Stripe Account & Products

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create a product with monthly pricing ($449/month)
3. Copy the Price ID to your `.env` file
4. Enable Stripe Radar for fraud detection (recommended)

### 4. Database Migration

The new tables will be created automatically when you start the server:
- `users` - User accounts
- `signup_attempts` - Signup tracking
- `ip_blocklist` - Blocked IPs

Or run manually:
```python
from app.database import Base, engine
from app.models import user
Base.metadata.create_all(bind=engine)
```

### 5. Update Frontend Signup

Update `frontend/app/signup/page.tsx` to:
1. Include device fingerprint
2. Call the new `/auth/signup` endpoint
3. Handle email verification

See the updated signup page code below.

### 6. Enable Rate Limiting (Optional)

In `app/main.py`, add:

```python
from app.middleware.rate_limit import RateLimitMiddleware

app.add_middleware(
    RateLimitMiddleware,
    calls=10,  # Max requests
    period=60  # Per 60 seconds
)
```

## 🔒 Fraud Prevention Features

### Active Protections:

1. **Email Tracking** - One email = one trial
2. **IP Rate Limiting** - Max 2 signups per IP per 24h
3. **Device Fingerprinting** - Track devices
4. **Credit Card Verification** - Via Stripe
5. **Disposable Email Blocking** - Blocks temp emails
6. **Agency Name Similarity** - Flags similar names

### Configuration:

Edit `app/services/fraud_detection.py`:

```python
MAX_SIGNUPS_PER_IP = 2  # Adjust as needed
MAX_SIGNUPS_PER_EMAIL = 1
DISPOSABLE_EMAIL_DOMAINS = [...]  # Add more domains
```

## 📊 Monitoring

### Check Signup Attempts:

```python
from app.database import get_db
from app.models.user import SignupAttempt

db = next(get_db())
attempts = db.query(SignupAttempt).filter(
    SignupAttempt.success == False
).all()
```

### Block an IP:

```python
from app.services import fraud_detection
from datetime import datetime, timedelta

fraud_detection.FraudDetectionService.block_ip(
    db=db,
    ip_address="1.2.3.4",
    reason="Fraudulent activity",
    blocked_until=datetime.utcnow() + timedelta(days=30)
)
```

## 🧪 Testing

### Test Stripe Integration:

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires auth: `4000 0025 0000 3155`

### Test Fraud Detection:

1. Try signing up twice with same email → Should block
2. Try signing up 3 times from same IP → Should block after 2
3. Use disposable email → Should block
4. Use same credit card twice → Should block (via Stripe)

## ⚠️ Important Notes

1. **PCI Compliance**: In production, use Stripe Elements on frontend (not sending card data to your backend)
2. **Email Verification**: Implement email sending service (SendGrid, AWS SES, etc.)
3. **Stripe Webhooks**: Set up webhooks for subscription events
4. **Database**: Use PostgreSQL in production (not SQLite)
5. **Rate Limiting**: Consider Redis for distributed rate limiting

## 🔗 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Radar](https://stripe.com/docs/radar)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)

