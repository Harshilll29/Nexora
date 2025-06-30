import express from 'express';
import { signup, login, logout, onboard, forgotPassword, verifyOTPAndResetPassword } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post('/onboarding', protectRoute, onboard);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', verifyOTPAndResetPassword);

// This route will return the user details if the user is logged in
router.get('/me', protectRoute, (req,res) =>{
    res.status(200).json({success: true, user: req.user});
})

export default router;