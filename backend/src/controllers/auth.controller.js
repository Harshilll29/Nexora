import { upsertStreamUser } from '../lib/stream.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import * as math from 'mathjs';
import { sendOTPEmail } from '../lib/emailService.js';
import { generateOTP, generateOTPExpiry, isOTPValid } from '../utils/otpUtils.js';


export async function signup(req, res) {
    const { fullname, email, password } = req.body;
    try {
        if (!email || !password || !fullname) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists please use a different one" });
        }


        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://api.dicebear.com/7.x/avataaars/png?seed=${idx}`;

        const newUser = await User.create({
            email, fullname, password, profilePic: randomAvatar,
        })

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullname,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.fullname}`);
        } catch (error) {
            console.log("Error creating Stream user:", error);
        }


        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d'
        });

        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 1000,
            httpOnly: true, //Prevents XSS attacks
            sameSite: 'None', //Prevents CSRF attacks
            secure: true,
        });
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic
            }
        });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d'
        });

        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 1000,
            httpOnly: true, //Prevents XSS attacks
            sameSite: 'None', //Prevents CSRF attacks
            secure: true,
        });

        res.status(200).json({ success: true, user })

    } catch (error) {
        console.log("Error during login:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function logout(req, res) {
    res.clearCookie('jwt')
    res.status(200).json({ success: true, message: "Logged out successfully" })
}

export async function onboard(req, res) {
    try {
        const userId = req.user._id;

        const { fullname, bio, nativeLanguage, learningLanguage, location } = req.body;

        if (!fullname || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(401).json({
                message: "All fields are required", missingFields: [
                    !fullname && 'fullname',
                    !bio && 'bio',
                    !nativeLanguage && 'nativeLanguage',
                    !learningLanguage && 'learningLanguage',
                    !location && 'location',
                ].filter(Boolean)
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, { new: true });

        if (!updatedUser) {
            return res.status(401).json({ message: 'User not found!' })
        }

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullname,
                image: updatedUser.profilePic || "",
            })
            console.log(`Stream user updated for ${updatedUser.fullname}`);
        } catch (error) {
            console.log("Error updating Stream user during onboarding:", error);
            return res.status(500).json({ message: "Internal server error while updating Stream user" });
        }


        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error during onboarding:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// export async function forgotPassword(req, res) {
//     try {
//         const { email } = req.body;

//         if (!email) {
//             return res.status(400).json({ message: "Email is required" });
//         }

//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User with this email doesn't exist" });
//         }

//         // Generate OTP
//         const otp = generateOTP();
//         const otpExpires = generateOTPExpiry();

//         // Save OTP to database
//         user.resetPasswordOTP = otp;
//         user.resetPasswordOTPExpires = otpExpires;
//         await user.save();

//         // Send OTP via email
//         const emailResult = await sendOTPEmail(user.email, otp, user.fullname);

//         if (!emailResult.success) {
//             return res.status(500).json({
//                 message: "Failed to send OTP email",
//                 error: emailResult.error
//             });
//         }

//         res.status(200).json({
//             message: "OTP sent successfully to your email",
//             email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email for security
//         });

//     } catch (error) {
//         console.error("Error in forgotPassword:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

// export async function verifyOTPAndResetPassword(req, res) {
//     try {
//         const { email, otp, newPassword } = req.body;

//         if (!email || !otp || !newPassword) {
//             return res.status(400).json({
//                 message: "Email, OTP, and new password are required"
//             });
//         }

//         // Validate password strength
//         if (newPassword.length < 6) {
//             return res.status(400).json({
//                 message: "Password must be at least 6 characters long"
//             });
//         }

//         // Find user
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Check if OTP exists
//         if (!user.resetPasswordOTP) {
//             return res.status(400).json({ message: "No OTP requested for this email" });
//         }

//         // Check if OTP matches
//         if (user.resetPasswordOTP !== otp) {
//             return res.status(400).json({ message: "Invalid OTP" });
//         }

//         // Check if OTP is expired
//         if (!isOTPValid(user.resetPasswordOTPExpires)) {
//             // Clear expired OTP
//             user.resetPasswordOTP = null;
//             user.resetPasswordOTPExpires = null;
//             await user.save();

//             return res.status(400).json({ message: "OTP has expired. Please request a new one." });
//         }


//         // Update password and clear OTP
//         user.password = newPassword;
//         user.resetPasswordOTP = null;
//         user.resetPasswordOTPExpires = null;
//         await user.save();

//         res.status(200).json({
//             message: "Password reset successfully. You can now login with your new password."
//         });

//     } catch (error) {
//         console.error("Error in verifyOTPAndResetPassword:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email doesn't exist" });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = generateOTPExpiry();

        // Save OTP to database
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpires = otpExpires;
        await user.save();

        // Send OTP via email
        const emailResult = await sendOTPEmail(user.email, otp, user.fullname);

        if (!emailResult.success) {
            return res.status(500).json({
                message: "Failed to send OTP email",
                error: emailResult.error
            });
        }

        res.status(200).json({
            message: "OTP sent successfully to your email",
            email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email for security
        });

    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This is the endpoint your frontend is calling: /auth/verify-otp-reset-password
export async function verifyOTPAndResetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                message: "Email, OTP, and new password are required"
            });
        }

        // Validate password strength
        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if OTP exists
        if (!user.resetPasswordOTP) {
            return res.status(400).json({ message: "No OTP requested for this email" });
        }

        // Check if OTP matches
        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Check if OTP is expired
        if (!isOTPValid(user.resetPasswordOTPExpires)) {
            // Clear expired OTP
            user.resetPasswordOTP = null;
            user.resetPasswordOTPExpires = null;
            await user.save();

            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        // Update password and clear OTP
        user.password = newPassword;
        user.resetPasswordOTP = null;
        user.resetPasswordOTPExpires = null;
        await user.save();

        res.status(200).json({
            message: "Password reset successfully. You can now login with your new password."
        });

    } catch (error) {
        console.error("Error in verifyOTPAndResetPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}