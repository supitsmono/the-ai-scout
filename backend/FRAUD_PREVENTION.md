# Fraud Prevention Guide - Free Trial Abuse Prevention

Dit document beschrijft hoe je unlimited free trial abuse kunt voorkomen.

## 🔒 Strategieën

### 1. **Email-based Tracking**
- Eén email = één free trial
- Email verificatie vereist voordat trial start
- Check op disposable/temporary email services

### 2. **IP Address Tracking**
- Limiteer aantal signups per IP (bijv. 2-3 per 24 uur)
- Track IP addresses in database
- Block bekende VPN/proxy IP ranges (optioneel)

### 3. **Credit Card Verification**
- Gebruik Stripe voor payment processing
- Stripe detecteert automatisch:
  - Dezelfde credit card
  - Test cards
  - Fraudulent patterns
- Card fingerprinting (laatste 4 cijfers + expiry)

### 4. **Device Fingerprinting**
- Browser fingerprint (user agent, screen size, timezone)
- Cookies/localStorage tracking
- Combineer meerdere signals

### 5. **Rate Limiting**
- Limiteer signup attempts per IP
- Limiteer API calls per endpoint
- Progressive delays bij verdachte activiteit

### 6. **Account Linking**
- Check op:
  - Zelfde agency name (fuzzy matching)
  - Zelfde full name
  - Zelfde credit card (via Stripe)
  - Zelfde device fingerprint

## 📋 Implementatie Checklist

### Backend Setup

1. **User Model & Database**
   - User accounts met email, IP, device fingerprint
   - Trial tracking (start date, end date, status)
   - Payment method tracking

2. **Stripe Integration**
   - Setup Stripe account
   - Payment method verification
   - Subscription management

3. **Rate Limiting**
   - Implement rate limiting middleware
   - Per IP, per email, per endpoint

4. **Email Verification**
   - Send verification email
   - Block unverified accounts

5. **Fraud Detection Service**
   - Integrate met services zoals:
     - Stripe Radar (built-in)
     - MaxMind GeoIP2
     - Clearbit (email validation)

## 🚀 Quick Start

Zie de implementatie bestanden:
- `app/models/user.py` - User model
- `app/routes/auth.py` - Signup/login endpoints
- `app/services/fraud_detection.py` - Fraud checks
- `app/services/stripe_service.py` - Stripe integration

