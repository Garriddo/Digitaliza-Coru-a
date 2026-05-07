import { Router } from 'express';
import healthCheck from './health-check.js';
import authRouter from './auth.js';
import stripeRouter from './stripe.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/auth', authRouter);
    router.use('/stripe', stripeRouter);

    return router;
};