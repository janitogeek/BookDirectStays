import express from 'express';
import { 
  createCheckoutSession, 
  handleWebhook, 
  createPortalSession, 
  getSubscription, 
  getCustomerSubscriptions, 
  getInvoice 
} from "../server/stripe";

const app = express();

// Middleware for JSON parsing (except webhook which needs raw body)
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, stripe-signature');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Stripe routes
app.post("/api/stripe/create-checkout-session", createCheckoutSession);
app.post("/api/stripe/create-portal-session", createPortalSession);
app.get("/api/stripe/subscription/:subscriptionId", getSubscription);
app.get("/api/stripe/customer/:customerId/subscriptions", getCustomerSubscriptions);
app.get("/api/stripe/invoice/:invoiceId", getInvoice);
app.post("/api/stripe/webhook", handleWebhook);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Handle all other API routes
app.all("/api/*", (req, res) => {
  res.status(404).json({ message: `Route ${req.path} not found` });
});

// Export for Vercel
export default app;