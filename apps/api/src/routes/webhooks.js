import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /webhooks/stripe - Handle Stripe webhook events
// CRITICAL: Use express.raw() middleware to capture raw body for signature verification
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Validate signature header and webhook secret exist
  if (!sig || !webhookSecret) {
    logger.warn('Webhook request missing signature or secret');
    throw new Error('Missing signature or webhook secret');
  }

  // CRITICAL: Validate req.body is a Buffer (not parsed JSON)
  if (!Buffer.isBuffer(req.body)) {
    logger.error('Webhook body is not a Buffer', { type: typeof req.body });
    throw new Error('Webhook body must be a Buffer');
  }

  // Construct and verify the event using raw body (Buffer)
  // Pass req.body directly - do NOT parse, stringify, clone, or modify it
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