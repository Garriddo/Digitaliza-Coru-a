import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Plan pricing configuration with Stripe price IDs
const PLAN_CONFIG = {
  basico: {
    name: 'Plan Básico',
    oneTimePriceId: 'price_1TLMc6848C4rUNZMOiPrTx6J',
    subscriptionPriceId: 'price_1TLMc6848C4rUNZMYMvscXOA',
  },
  pro: {
    name: 'Plan Pro',
    oneTimePriceId: 'price_1TLMdq848C4rUNZMXDrFyiH0',
    subscriptionPriceId: 'price_1TLMdq848C4rUNZME2rqfAcC',
  },
  premium: {
    name: 'Plan Premium',
    oneTimePriceId: 'price_1TLMeH848C4rUNZMplmSFVq2',
    subscriptionPriceId: 'price_1TLMep848C4rUNZMhBzNMlMv',
  },
};

// Helper function to extract user ID from request
const extractUserId = (req) => {
  // Try to get user_id from request body (passed by frontend)
  if (req.body && req.body.user_id) {
    return req.body.user_id;
  }

  // Try to get from query parameters
  if (req.query && req.query.user_id) {
    return req.query.user_id;
  }

  // Try to get from headers (if JWT token is passed)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Note: In a real scenario, you would decode the JWT here
    // For now, we rely on the frontend passing user_id in the request body
  }

  return null;
};

// POST /stripe/create-checkout - Create Checkout Session for payment
router.post('/create-checkout', async (req, res) => {
  const { plan, successUrl, cancelUrl, user_id } = req.body;

  // Validate required fields
  if (!plan) {
    return res.status(400).json({
      error: 'Plan is required',
    });
  }

  // Validate plan exists
  if (!PLAN_CONFIG[plan]) {
    return res.status(400).json({
      error: 'Invalid plan. Must be one of: basico, pro, premium',
    });
  }

  // Extract and validate user_id
  const authenticatedUserId = extractUserId(req) || user_id;
  if (!authenticatedUserId) {
    throw new Error('User ID is required. Please provide user_id in request body or authenticate.');
  }

  // Validate user exists in database
  const user = await pb.collection('users').getOne(authenticatedUserId).catch(() => null);
  if (!user) {
    throw new Error(`User not found: ${authenticatedUserId}`);
  }

  const planConfig = PLAN_CONFIG[plan];

  logger.info('Create checkout request received', {
    plan,
    userId: authenticatedUserId,
    userEmail: user.email,
    oneTimePriceId: planConfig.oneTimePriceId,
    subscriptionPriceId: planConfig.subscriptionPriceId,
  });

  // Create Stripe Checkout Session with subscription mode
  // Line items: (1) one-time initial payment, (2) recurring monthly subscription
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: planConfig.oneTimePriceId,
        quantity: 1,
      },
      {
        price: planConfig.subscriptionPriceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl || process.env.STRIPE_SUCCESS_URL,
    cancel_url: cancelUrl || process.env.STRIPE_CANCEL_URL,
    customer_email: user.email,
    metadata: {
      user_id: authenticatedUserId,
      plan,
    },
  });

  logger.info('Stripe checkout session created successfully', {
    sessionId: session.id,
    userId: authenticatedUserId,
    plan,
    amountTotal: session.amount_total,
    metadata: session.metadata,
  });

  res.json({ url: session.url });
});

// GET /stripe/session/:sessionId - Retrieve session details
router.get('/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  logger.info('Retrieving session details', { sessionId });

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  logger.info('Session retrieved successfully', {
    sessionId: session.id,
    paymentStatus: session.payment_status,
  });

  res.json({
    id: session.id,
    status: session.payment_status,
    amountTotal: session.amount_total,
    customerEmail: session.customer_details?.email,
    metadata: session.metadata,
  });
});

// POST /stripe/confirm-session - Confirm payment and activate plan
router.post('/confirm-session', async (req, res) => {
  const { session_id } = req.body;

  // Validate required fields
  if (!session_id) {
    return res.status(400).json({
      error: 'session_id is required',
    });
  }

  logger.info('Confirm session request received', { sessionId: session_id });

  // Retrieve session from Stripe
  const session = await stripe.checkout.sessions.retrieve(session_id);

  // Verify payment status is 'paid'
  if (session.payment_status !== 'paid') {
    logger.warn('Payment not confirmed for session', {
      sessionId: session_id,
      paymentStatus: session.payment_status,
    });
    throw new Error('Payment not confirmed or session invalid');
  }

  // Extract metadata and session details
  const { user_id, plan } = session.metadata || {};
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  logger.info('Processing confirm-session', {
    sessionId: session_id,
    userId: user_id,
    plan,
    customerId,
    subscriptionId,
    amountTotal: session.amount_total,
  });

  // Validate user_id exists in metadata
  if (!user_id) {
    logger.error('Missing user_id in session metadata', {
      sessionId: session_id,
      metadata: session.metadata,
    });
    throw new Error('Missing user_id in session metadata');
  }

  // Validate user exists in database
  const user = await pb.collection('users').getOne(user_id).catch(() => null);
  if (!user) {
    logger.error('User not found for session', {
      sessionId: session_id,
      userId: user_id,
    });
    throw new Error('User not found');
  }

  // Validate plan is provided
  if (!plan) {
    logger.error('Missing plan in session metadata', {
      sessionId: session_id,
      metadata: session.metadata,
    });
    throw new Error('Missing plan in session metadata');
  }

  // Update user record with plan, estado, and Stripe IDs
  const updateData = {
    plan,
    estado: 'activo',
    datos_negocio: {
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
    },
  };

  const updatedUser = await pb.collection('users').update(user_id, updateData);
  logger.info('User plan updated after confirm-session', {
    userId: user_id,
    plan,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
  });

  // Create payment record
  const today = new Date().toISOString().split('T')[0];
  await pb.collection('payments').create({
    user_id,
    plan,
    cantidad: session.amount_total / 100,
    estado: 'completado',
    fecha: today,
    stripe_transaction_id: session_id,
    stripe_session_id: session_id,
  });

  logger.info('Payment record created', {
    userId: user_id,
    plan,
    amount: session.amount_total / 100,
    sessionId: session_id,
  });

  res.json({
    success: true,
    message: 'Plan activado correctamente',
    plan,
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      plan: updatedUser.plan,
      estado: updatedUser.estado,
    },
  });
});

// POST /stripe/webhook - Handle Stripe webhook events
// CRITICAL: Use express.raw() middleware to capture raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Validate signature header and webhook secret exist
  if (!sig || !webhookSecret) {
    logger.warn('Webhook request missing signature or secret');
    throw new Error('Missing signature or webhook secret');
  }

  // Construct and verify the event using raw body (Buffer)
  // req.body is a Buffer when using express.raw() middleware
  const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

  logger.info('Webhook event received and verified', { type: event.type });

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { user_id, plan } = session.metadata || {};

    logger.info('Processing checkout.session.completed', {
      sessionId: session.id,
      userId: user_id,
      plan,
      customerId: session.customer,
      subscriptionId: session.subscription,
      amountTotal: session.amount_total,
    });

    // Validate user_id exists in metadata
    if (!user_id) {
      logger.error('Missing user_id in checkout session metadata', {
        sessionId: session.id,
        metadata: session.metadata,
      });
      throw new Error('Missing user_id in metadata');
    }

    // Validate user exists in database
    const user = await pb.collection('users').getOne(user_id).catch(() => null);
    if (!user) {
      logger.error('User not found for checkout session', {
        sessionId: session.id,
        userId: user_id,
      });
      throw new Error('User not found');
    }

    // Validate plan is provided
    if (!plan) {
      logger.error('Missing plan in checkout session metadata', {
        sessionId: session.id,
        metadata: session.metadata,
      });
      throw new Error('Missing plan in metadata');
    }

    // Update user record with plan, estado, and Stripe IDs
    const updateData = {
      plan,
      estado: 'activo',
      datos_negocio: {
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
      },
    };

    await pb.collection('users').update(user_id, updateData);
    logger.info('User plan updated after checkout', {
      userId: user_id,
      plan,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
    });

    // Create payment record
    const today = new Date().toISOString().split('T')[0];
    await pb.collection('payments').create({
      user_id,
      plan,
      cantidad: session.amount_total / 100,
      estado: 'completado',
      fecha: today,
      stripe_transaction_id: session.payment_intent || '',
      stripe_session_id: session.id,
    });

    logger.info('Payment record created', {
      userId: user_id,
      plan,
      amount: session.amount_total / 100,
      sessionId: session.id,
    });
  }

  // Handle invoice.payment_succeeded event
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object;
    logger.info('Invoice payment succeeded', {
      invoiceId: invoice.id,
      customerId: invoice.customer,
      amount: invoice.amount_paid,
    });
  }

  // Handle customer.subscription.updated event
  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object;
    logger.info('Subscription updated', {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      status: subscription.status,
    });
  }

  // Handle customer.subscription.deleted event
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    logger.info('Subscription cancelled', {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
    });
  }

  // Always return 200 OK for valid webhook events
  res.status(200).json({ received: true });
});

export default router;