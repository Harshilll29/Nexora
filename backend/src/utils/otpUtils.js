import crypto from 'crypto';

// Generate 6-digit OTP
export const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Generate OTP expiry time (10 minutes from now)
export const generateOTPExpiry = () => {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

// Verify if OTP is still valid
export const isOTPValid = (otpExpires) => {
    return new Date() < new Date(otpExpires);
};