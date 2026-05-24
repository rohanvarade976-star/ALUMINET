const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { register, login, refreshToken, verifyEmail, logout, getMe, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Strict rate limiter for auth routes (10 requests / 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login',    authLimiter, login);
router.post('/refresh',  refreshToken);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
