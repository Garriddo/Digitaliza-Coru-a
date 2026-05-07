import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to generate random token
const generateToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// POST /auth/register - Register new user
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  // Validate required fields
  if (!email || !password || !name) {
    return res.status(400).json({
      error: 'Email, password, and name are required',
    });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: 'Invalid email format',
    });
  }

  // Validate password length
  if (password.length < 8) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long',
    });
  }

  logger.info('Register request received', { email, name });

  // Check if email already exists
  const existingUser = await pb.collection('users').getFirstListItem(`email = "${email}"`, {
    requestKey: null,
  }).catch(() => null);

  if (existingUser) {
    logger.warn('Registration attempt with existing email', { email });
    return res.status(400).json({
      error: 'Email already registered',
    });
  }

  // Create new user
  const newUser = await pb.collection('users').create({
    email,
    password,
    passwordConfirm: password,
    name,
    plan: null,
    estado: 'no activo',
  });

  logger.info('User registered successfully', {
    userId: newUser.id,
    email: newUser.email,
  });

  res.status(201).json({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    message: 'Usuario registrado exitosamente',
  });
});

// POST /auth/login - Authenticate user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required',
    });
  }

  logger.info('Login request received', { email });

  // Authenticate user
  const authData = await pb.collection('users').authWithPassword(email, password).catch(() => {
    throw new Error('Email o contraseña incorrectos');
  });

  logger.info('User logged in successfully', {
    userId: authData.record.id,
    email: authData.record.email,
  });

  res.json({
    token: pb.authStore.token,
    user: {
      id: authData.record.id,
      email: authData.record.email,
      name: authData.record.name,
      plan: authData.record.plan,
      estado: authData.record.estado,
    },
  });
});

// POST /auth/forgot-password - Request password reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Validate email required
  if (!email) {
    return res.status(400).json({
      error: 'Email is required',
    });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: 'Invalid email format',
    });
  }

  logger.info('Forgot password request received', { email });

  // Check if email exists
  const user = await pb.collection('users').getFirstListItem(`email = "${email}"`, {
    requestKey: null,
  }).catch(() => null);

  if (!user) {
    logger.warn('Forgot password request for non-existent email', { email });
    throw new Error('Email no encontrado');
  }

  // Generate reset token
  const token = generateToken(32);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  // Create password reset record
  await pb.collection('password_resets').create({
    email,
    token,
    expires_at: expiresAt,
    used: false,
  });

  logger.info('Password reset token created', { email, token });

  // TODO: Send email via PocketBase hook
  // The email sending should be handled by a PocketBase hook that sends the reset link

  res.json({
    message: 'Revisa tu email para recuperar tu contraseña',
  });
});

// POST /auth/reset-password - Reset password with token
router.post('/reset-password', async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  // Validate required fields
  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({
      error: 'Token, newPassword, and confirmPassword are required',
    });
  }

  // Validate password length
  if (newPassword.length < 8) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long',
    });
  }

  // Validate passwords match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      error: 'Passwords do not match',
    });
  }

  logger.info('Reset password request received', { token });

  // Find password reset record
  const resetRecord = await pb.collection('password_resets').getFirstListItem(`token = "${token}"`, {
    requestKey: null,
  }).catch(() => null);

  if (!resetRecord) {
    logger.warn('Reset password attempt with invalid token', { token });
    throw new Error('Token inválido o expirado');
  }

  // Check if token is expired
  const expiresAt = new Date(resetRecord.expires_at);
  if (expiresAt < new Date()) {
    logger.warn('Reset password attempt with expired token', { token });
    throw new Error('Token expirado');
  }

  // Check if token has been used
  if (resetRecord.used) {
    logger.warn('Reset password attempt with already used token', { token });
    throw new Error('Token ya ha sido utilizado');
  }

  // Find user by email
  const user = await pb.collection('users').getFirstListItem(`email = "${resetRecord.email}"`, {
    requestKey: null,
  });

  // Update user password
  await pb.collection('users').update(user.id, {
    password: newPassword,
    passwordConfirm: newPassword,
  });

  // Mark token as used
  await pb.collection('password_resets').update(resetRecord.id, {
    used: true,
  });

  logger.info('Password reset successfully', {
    userId: user.id,
    email: user.email,
  });

  res.json({
    message: 'Contraseña actualizada exitosamente',
  });
});

// POST /auth/logout - Logout user
router.post('/logout', async (req, res) => {
  logger.info('Logout request received');

  // Clear authentication state
  pb.authStore.clear();

  res.json({
    message: 'Sesión cerrada',
  });
});

export default router;