# 🚀 Complete Stripe Integration Guide for BookDirectStays

## Overview
This guide provides step-by-step instructions to set up Stripe payments and invoicing for your 2 yearly subscription plans:
- **Basic Plan**: €99.99/year
- **Premium Plan**: €499.99/year

## ✅ What's Already Implemented

Your Stripe integration includes:
- ✅ **Checkout Sessions**: Secure payment processing
- ✅ **Webhook Handling**: Automatic subscription management
- ✅ **Customer Portal**: Self-service subscription management
- ✅ **Invoice Management**: Automated invoicing and tracking
- ✅ **Error Handling**: Robust error handling and validation
- ✅ **Subscription APIs**: Full subscription lifecycle management

## 🔧 Step 1: Stripe Dashboard Setup

### 1.1 Create Products in Stripe Dashboard

1. **Login** to your Stripe Dashboard at [dashboard.stripe.com](https://dashboard.stripe.com)

2. **Navigate** to Products → **Add Product**

3. **Create Basic Plan**:
   - **Name**: `Basic Listing Plan`
   - **Description**: `Annual subscription for basic property listings`
   - **Pricing Model**: `Recurring`
   - **Price**: `€99.99`
   - **Billing Period**: `Yearly`
   - **Currency**: `EUR`
   - ✅ Copy the **Price ID** (starts with `price_...`)

4. **Create Premium Plan**:
   - **Name**: `Premium Listing Plan`
   - **Description**: `Annual subscription for premium property listings with advanced features`
   - **Pricing Model**: `Recurring`
   - **Price**: `€499.99`
   - **Billing Period**: `Yearly`
   - **Currency**: `EUR`
   - ✅ Copy the **Price ID** (starts with `price_...`)

### 1.2 Enable Customer Portal

1. **Navigate** to Settings → **Billing** → **Customer Portal**
2. **Enable** the Customer Portal
3. **Configure** allowed actions:
   - ✅ Update payment method
   - ✅ Download invoices
   - ✅ View subscription history
   - ✅ Cancel subscriptions (optional)

### 1.3 Set Up Webhooks

1. **Navigate** to Developers → **Webhooks** → **Add endpoint**

2. **Endpoint URL**: 
   - **Production**: `https://yourdomain.com/api/stripe/webhook`
   - **Development**: `http://localhost:5000/api/stripe/webhook`

3. **Events to send**:
   ```
   ✅ SELECT ALL EVENTS ✅
   ```
   
   **Recommended**: Check the **"Select all events"** box to future-proof your integration and capture comprehensive business data.

4. ✅ Copy the **Webhook Secret** (starts with `whsec_...`)

## 🔑 Step 2: Environment Variables

### 2.1 Backend Environment (.env in root directory)

Create `.env` file in your project root:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Application URLs
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Your existing environment variables...
```

### 2.2 Frontend Environment (.env in client/ directory)

Update `client/.env`:

```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_CLIENT_URL=http://localhost:5173

# Your existing Airtable configuration...
VITE_AIRTABLE_API_KEY=your_airtable_api_key_here
VITE_AIRTABLE_BASE_ID=your_airtable_base_id_here
```

## 📝 Step 3: Update Price IDs in Code

Update the price IDs in `server/stripe.ts`:

```typescript
const PRICE_IDS = {
  'Basic (€99.99/year)': 'price_1234567890abcdef',     // Your actual Basic Price ID
  'Premium (€499.99/year)': 'price_1234567890ghijk',   // Your actual Premium Price ID
};
```

## 🧪 Step 4: Testing the Integration

### 4.1 Start Development Servers

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 4.2 Test Payment Flow

1. **Navigate** to `http://localhost:5173/submit`
2. **Fill out** the property submission form
3. **Select** a subscription plan (Basic or Premium)
4. **Click Submit** → Should redirect to Stripe Checkout
5. **Use test card**: `4242 4242 4242 4242`
   - **Expiry**: Any future date
   - **CVC**: Any 3 digits
   - **ZIP**: Any 5 digits
6. **Complete payment** → Should redirect to success page

### 4.3 Test Subscription Management

1. **Create a test subscription** (follow 4.2)
2. **Get the customer ID** from Stripe Dashboard or webhook logs
3. **Test Customer Portal**:
   ```javascript
   // In browser console on your site
   fetch('/api/stripe/create-portal-session', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ customerId: 'cus_...' })
   }).then(r => r.json()).then(data => window.location.href = data.url)
   ```

### 4.4 Stripe Test Cards

| Purpose | Card Number | Description |
|---------|------------|-------------|
| **Success** | `4242 4242 4242 4242` | Payment succeeds |
| **Declined** | `4000 0000 0000 0002` | Payment declined |
| **3D Secure** | `4000 0025 0000 3155` | Requires authentication |
| **Insufficient Funds** | `4000 0000 0000 9995` | Insufficient funds |

## 📊 Step 5: Monitoring & Webhooks

### 5.1 Webhook Monitoring

Your webhooks will log the following events:

```bash
# Successful subscription creation
✅ Payment successful for submission: {...}
✅ Customer ID: cus_1234567890
✅ Subscription ID: sub_1234567890

# Monthly/Yearly renewals
✅ Subscription payment succeeded for: cus_1234567890
✅ Amount paid: 99.99 EUR

# Failed payments
❌ Subscription payment failed for: cus_1234567890
❌ Amount due: 99.99 EUR
❌ Attempt count: 1
```

### 5.2 Monitor in Stripe Dashboard

1. **Navigate** to Developers → **Webhooks**
2. **Click** on your webhook endpoint
3. **View** delivery attempts and responses
4. **Check** for any failed deliveries

## 🎯 Step 6: API Endpoints Available

Your integration provides these endpoints:

### Payment & Checkout
- `POST /api/stripe/create-checkout-session` - Create payment session
- `POST /api/stripe/webhook` - Handle Stripe events

### Subscription Management
- `POST /api/stripe/create-portal-session` - Customer portal access
- `GET /api/stripe/subscription/:subscriptionId` - Get subscription details
- `GET /api/stripe/customer/:customerId/subscriptions` - List customer subscriptions

### Invoice Management
- `GET /api/stripe/invoice/:invoiceId` - Get invoice details

## 💼 Step 7: Business Features

### 7.1 Automated Invoicing

Your setup automatically:
- ✅ **Creates invoices** for new subscriptions
- ✅ **Sends invoices** to customers via email
- ✅ **Processes payments** annually
- ✅ **Handles failed payments** with retry logic
- ✅ **Provides PDF invoices** via customer portal

### 7.2 Customer Self-Service

Customers can:
- ✅ **Update payment methods**
- ✅ **Download invoices**
- ✅ **View payment history**
- ✅ **Manage subscriptions**
- ✅ **Cancel subscriptions** (if enabled)

### 7.3 Admin Dashboard Data

Track via Stripe Dashboard:
- 📊 **Monthly Recurring Revenue (MRR)**
- 📊 **Annual Recurring Revenue (ARR)**
- 📊 **Churn rate**
- 📊 **Failed payment recovery**
- 📊 **Customer lifetime value**

## 🔐 Step 8: Security & Compliance

### 8.1 Security Features

- ✅ **Webhook signature verification**
- ✅ **Input validation and sanitization**
- ✅ **Error handling without data leakage**
- ✅ **Secure API key management**

### 8.2 PCI Compliance

- ✅ **Stripe handles all card data** (PCI DSS Level 1)
- ✅ **No card data stored** on your servers
- ✅ **Secure tokenization** for recurring payments

### 8.3 GDPR Compliance

- ✅ **Customer data control** via Customer Portal
- ✅ **Data export capabilities**
- ✅ **Subscription cancellation**

## 🚀 Step 9: Going Live

### 9.1 Switch to Live Mode

1. **Get live API keys** from Stripe Dashboard
2. **Update environment variables**:
   ```bash
   STRIPE_SECRET_KEY=sk_live_your_live_secret_key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
   ```
3. **Update webhook endpoint** to your production domain
4. **Test with real payment method**

### 9.2 Production Checklist

- [ ] Live API keys configured
- [ ] Webhook endpoint updated
- [ ] Price IDs updated for live products
- [ ] Customer Portal configured
- [ ] Email notifications enabled
- [ ] SSL certificate active
- [ ] Error monitoring enabled

## 🆘 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **"Invalid API Key"** | Check environment variables, ensure correct test/live keys |
| **Webhook signature failed** | Verify webhook secret, check endpoint URL |
| **Price not found** | Update `PRICE_IDS` in `server/stripe.ts` |
| **Customer portal not working** | Enable Customer Portal in Stripe Dashboard |
| **Payment fails** | Check webhook logs, verify price configuration |

### Debug Mode

Add logging to `server/stripe.ts`:

```typescript
console.log('Webhook event:', event.type);
console.log('Event data:', JSON.stringify(event.data, null, 2));
```

## 📞 Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: Available in Dashboard chat
- **BookDirectStays Support**: bookdirectstays@gmail.com

---

## ✅ Quick Setup Checklist

- [ ] 1. Create products in Stripe Dashboard
- [ ] 2. Copy price IDs to `server/stripe.ts`
- [ ] 3. Set up webhook endpoint
- [ ] 4. Configure environment variables
- [ ] 5. Enable Customer Portal
- [ ] 6. Test payment flow
- [ ] 7. Test webhook delivery
- [ ] 8. Monitor in production

**🎉 Your Stripe integration is now complete!** You have full subscription management, automated invoicing, and customer self-service capabilities.