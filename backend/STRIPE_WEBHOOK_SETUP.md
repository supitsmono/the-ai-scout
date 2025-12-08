# Stripe Webhook Setup Guide

This guide explains how to configure Stripe webhooks for automatic subscription updates.

## Overview

Stripe webhooks allow your application to receive real-time updates about subscription events, such as:
- Subscription created/updated/deleted
- Payment succeeded/failed
- Trial period changes

## Webhook Endpoint

The webhook endpoint is available at:
```
POST /stripe/webhook
```

## Setup Steps

### 1. Get Your Webhook Secret

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Enter your webhook URL: `https://your-domain.com/stripe/webhook`
5. Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Copy the **Signing secret** (starts with `whsec_`)

### 2. Configure Environment Variable

Add the webhook secret to your environment variables:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Note:** Currently, the webhook endpoint uses `STRIPE_SECRET_KEY` for verification. For production, you should:

1. Add `STRIPE_WEBHOOK_SECRET` to `backend/app/config.py`
2. Update `backend/app/routes/stripe.py` to use `STRIPE_WEBHOOK_SECRET` instead of `STRIPE_SECRET_KEY`

### 3. Test Webhook Locally (Development)

For local development, use [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Linux/Windows: See Stripe docs

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:8000/stripe/webhook
```

This will give you a webhook signing secret that you can use in your `.env` file.

### 4. Test Webhook Events

Trigger test events using Stripe CLI:

```bash
# Test subscription created
stripe trigger customer.subscription.created

# Test payment succeeded
stripe trigger invoice.payment_succeeded

# Test payment failed
stripe trigger invoice.payment_failed
```

## Webhook Events Handled

### `customer.subscription.created`
- Updates user's `subscription_status` to "trial" or "active" based on subscription status

### `customer.subscription.updated`
- Updates user's `subscription_status` based on Stripe subscription status:
  - `active` → "active"
  - `trialing` → "trial"
  - `past_due` → "active" (still active but payment failed)
  - `canceled` / `unpaid` → "cancelled"
  - `incomplete` / `incomplete_expired` → "expired"

### `customer.subscription.deleted`
- Sets user's `subscription_status` to "cancelled"

### `invoice.payment_succeeded`
- Ensures user's `subscription_status` is set to "active"

### `invoice.payment_failed`
- Logs the failure (doesn't change subscription status immediately, as Stripe handles retries)

## Security

### Webhook Signature Verification

The webhook endpoint verifies the signature of incoming webhooks to ensure they're from Stripe:

```python
event = stripe.Webhook.construct_event(
    payload,
    signature,
    webhook_secret
)
```

**Important:** Always verify webhook signatures in production to prevent unauthorized requests.

### Best Practices

1. **Use HTTPS**: Webhooks should only be sent to HTTPS endpoints
2. **Verify Signatures**: Always verify webhook signatures
3. **Idempotency**: Handle duplicate webhook events gracefully
4. **Error Handling**: Return 200 OK even if processing fails (log errors for investigation)
5. **Timeout**: Process webhooks quickly (Stripe has a 30-second timeout)

## Troubleshooting

### Webhook not receiving events

1. Check that the webhook endpoint URL is correct in Stripe Dashboard
2. Verify the endpoint is accessible (not behind firewall)
3. Check server logs for errors
4. Use Stripe Dashboard → Webhooks → Select endpoint → View logs

### "Invalid signature" error

1. Verify `STRIPE_WEBHOOK_SECRET` is set correctly
2. Ensure you're using the correct signing secret for your endpoint
3. Check that the raw request body is being used (not parsed JSON)

### Webhook events not updating database

1. Check server logs for errors
2. Verify database connection
3. Check that user exists with matching `stripe_customer_id`
4. Review webhook processing logic in `backend/app/services/webhook_service.py`

## Production Checklist

- [ ] Webhook endpoint is accessible via HTTPS
- [ ] `STRIPE_WEBHOOK_SECRET` is set in production environment
- [ ] Webhook signature verification is enabled
- [ ] All required events are selected in Stripe Dashboard
- [ ] Error logging is configured
- [ ] Webhook endpoint returns 200 OK for successful processing
- [ ] Database updates are working correctly
- [ ] Test webhook events in production (use test mode first)

## Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)

