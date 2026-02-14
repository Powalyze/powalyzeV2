# Stripe Integration Guide for Powalyze

## 🎯 Overview

This guide covers the complete Stripe integration for Pro subscriptions with automatic payment processing.

---

## 📋 Prerequisites

1. **Stripe Account**: [Create account](https://dashboard.stripe.com/register)
2. **Stripe CLI** (for webhook testing): `npm install -g stripe`
3. **Environment Variables** configured

---

## 🔑 Step 1: Get Stripe Keys

### In Stripe Dashboard:

1. Go to **Developers** → **API Keys**
2. Copy your keys:
   - **Publishable key**: Starts with `pk_test_` or `pk_live_`
   - **Secret key**: Starts with `sk_test_` or `sk_live_`

### Add to `.env.local`:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

---

## 💰 Step 2: Create Stripe Products & Prices

### Via Stripe Dashboard:

1. Go to **Products** → **Add Product**
2. Create two products:

#### Product 1: Powalyze Pro (Monthly)
- Name: `Powalyze Pro - Mensuel`
- Description: `Abonnement mensuel Powalyze Pro`
- Pricing: **€29.00 EUR / month**
- Billing period: `Monthly`
- Copy the **Price ID**: `price_xxxxxxxxxxxxx`

#### Product 2: Powalyze Pro (Yearly)
- Name: `Powalyze Pro - Annuel`
- Description: `Abonnement annuel Powalyze Pro (-20%)`
- Pricing: **€24.00 EUR / month** billed yearly (€288/year)
- Billing period: `Yearly`
- Copy the **Price ID**: `price_xxxxxxxxxxxxx`

### Via Stripe CLI (alternative):

```bash
# Create products and prices
stripe products create --name="Powalyze Pro - Mensuel" --description="Abonnement mensuel"
stripe prices create --product=prod_xxx --unit-amount=2900 --currency=eur --recurring[interval]=month

stripe products create --name="Powalyze Pro - Annuel" --description="Abonnement annuel (-20%)"
stripe prices create --product=prod_xxx --unit-amount=28800 --currency=eur --recurring[interval]=year
```

---

## 🔗 Step 3: Configure Webhooks

### For Local Development:

1. Install Stripe CLI:
```bash
stripe login
```

2. Forward webhooks to local:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. Copy the webhook secret displayed (starts with `whsec_`)
4. Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx`

### For Production (Vercel):

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://www.powalyze.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to Vercel Environment Variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

---

## 🎨 Step 4: Update Frontend (Pricing Page)

Add Stripe checkout buttons to `/app/pricing/page.tsx`:

```typescript
// Add to pricing page
const handleSubscribe = async (priceId: string, interval: 'monthly' | 'yearly') => {
  try {
    // Get auth token
    const token = localStorage.getItem('auth_token'); // Or from your auth context
    
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        priceId,
        billingInterval: interval
      })
    });

    const { url } = await response.json();
    
    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Erreur lors de la création de la session de paiement');
  }
};
```

Update the "Démarrer avec Pro" button:

```typescript
<button
  onClick={() => handleSubscribe('price_xxxxxxxxxxxxx', billingInterval)}
  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-400..."
>
  Démarrer avec Pro
</button>
```

---

## 🔧 Step 5: Test the Integration

### Test Mode (Recommended):

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVC.

### Testing Workflow:

1. **Start local webhook listener**:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

2. **Run dev server**:
   ```bash
   npm run dev
   ```

3. **Test checkout flow**:
   - Navigate to `http://localhost:3000/pricing`
   - Click "Démarrer avec Pro"
   - Use test card `4242 4242 4242 4242`
   - Complete checkout
   - Check console for webhook events
   - Verify subscription created in Supabase

4. **Verify database**:
   ```sql
   -- Check subscription was created
   SELECT * FROM subscriptions WHERE user_id = 'YOUR_USER_ID';
   
   -- Should show:
   -- status: 'active'
   -- stripe_customer_id: 'cus_xxx'
   -- stripe_subscription_id: 'sub_xxx'
   ```

---

## 🎫 Step 6: Customer Portal (Manage Subscription)

Add a "Gérer mon abonnement" button in user profile:

```typescript
const handleManageSubscription = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    
    // Get user's subscription
    const subResponse = await fetch('/api/subscriptions/check', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const { subscription } = await subResponse.json();
    
    // Create portal session
    const portalResponse = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        subscriptionId: subscription.stripe_subscription_id
      })
    });
    
    const { url } = await portalResponse.json();
    window.location.href = url;
  } catch (error) {
    console.error('Portal error:', error);
  }
};
```

---

## 📊 Step 7: Monitoring & Analytics

### Stripe Dashboard:

- **Payments**: Track successful/failed payments
- **Subscriptions**: Monitor active subscriptions
- **Customers**: View customer details
- **Events**: Debug webhook events

### Supabase Dashboard:

```sql
-- Active subscriptions
SELECT COUNT(*) FROM subscriptions WHERE status = 'active';

-- Revenue (approximate)
SELECT 
  COUNT(*) as active_subs,
  SUM(CASE WHEN billing_interval = 'monthly' THEN price_monthly ELSE price_yearly END) as monthly_revenue
FROM subscriptions 
WHERE status = 'active';

-- Trial conversions
SELECT 
  COUNT(*) as trials,
  COUNT(*) FILTER (WHERE status = 'active' AND plan = 'pro') as converted
FROM subscriptions 
WHERE plan = 'trial' OR (plan = 'pro' AND trial_start IS NOT NULL);
```

---

## 🚨 Troubleshooting

### Issue: "Invalid API Key"
**Solution**: Check `STRIPE_SECRET_KEY` in environment variables. Must start with `sk_test_` or `sk_live_`.

### Issue: "Webhook signature verification failed"
**Solution**: 
1. Check `STRIPE_WEBHOOK_SECRET` is correct
2. For local: Use secret from `stripe listen` output
3. For production: Use secret from Stripe Dashboard webhook settings

### Issue: "Subscription not created in database"
**Solution**: 
1. Check webhook is being received: `stripe events list`
2. Check Supabase logs for errors
3. Verify `metadata.user_id` is being sent in checkout session

### Issue: "Payment succeeds but user doesn't get access"
**Solution**: 
1. Check subscription row in database
2. Verify `status = 'active'`
3. Check middleware is reading subscription status correctly
4. Ensure RLS policies allow read access

---

## 🔒 Security Best Practices

1. **Never expose secret key**: Only use in server-side code
2. **Validate webhook signatures**: Always verify with `stripe.webhooks.constructEvent()`
3. **Use HTTPS**: Required for production webhooks
4. **Store minimal data**: Don't store full card details, let Stripe handle it
5. **Test webhooks**: Use `stripe trigger` to test all scenarios
6. **Monitor failed payments**: Set up email alerts in Stripe

---

## 📝 Checklist

- [ ] Stripe account created
- [ ] API keys added to `.env.local`
- [ ] Products & prices created in Stripe
- [ ] Webhooks configured (local + production)
- [ ] Frontend updated with checkout flow
- [ ] Tested with test cards
- [ ] Customer portal implemented
- [ ] Database verified (subscriptions created)
- [ ] Production webhook secret added to Vercel
- [ ] Monitoring dashboard configured

---

## 🎉 You're Done!

Your Stripe integration is complete. Users can now:
- ✅ Subscribe to Powalyze Pro (monthly or yearly)
- ✅ Pay securely via Stripe Checkout
- ✅ Get instant access after payment
- ✅ Manage subscription (cancel, update payment method)
- ✅ Receive automatic emails (payment success, failed, etc.)

---

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Subscriptions Guide](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Stripe Test Cards](https://stripe.com/docs/testing)
