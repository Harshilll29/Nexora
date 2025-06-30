import React, { useState, useEffect } from "react";
import { LoaderPinwheel } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useMutation } from "@tanstack/react-query";
import img from "../imgs/signupimg.png";
import toast from "react-hot-toast";
import { verifyOTPAndResetPassword } from "../lib/api";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from location state
  const { email, otp, verified } = location.state || {};


  const resetPasswordMutation = useMutation({
    mutationFn: verifyOTPAndResetPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successful!");
      navigate("/login");
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || "Failed to reset password. Try again.";
      toast.error(errorMessage);
      
      // If OTP is invalid or expired, redirect back to forgot password
      if (errorMessage.includes("OTP") || errorMessage.includes("expired")) {
        setTimeout(() => {
          navigate("/forgot-password");
        }, 2000);
      }
    }
  });

  useEffect(() => {
    if (!email || !otp || !verified) {
      toast.error("Invalid access. Please start from Forgot Password.");
      navigate("/forgot-password");
    }
  }, [email, otp, verified, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPassword) return toast.error("Please enter a new password");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    
    resetPasswordMutation.mutate({
      email,
      otp,
      newPassword,
    });
  };

  
  if (!email || !otp || !verified) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <LoaderPinwheel className="size-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Validating access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Form Side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <LoaderPinwheel className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Nexora
            </span>
          </div>

          <div className="w-full">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Reset Password</h2>
                  <p className="text-sm opacity-70">
                    Enter your new password and confirm it.
                  </p>
                  <p className="text-xs opacity-50 mt-1">
                    For: {email?.replace(/(.{2})(.*)(@.*)/, '$1***$3')}
                  </p>
                </div>
                
                <div className="form-control w-full space-y-2">
                  <label className="label">
                    <span className="label-text">New Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    className="input input-bordered w-full"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <div className="text-xs opacity-60">
                    Password must be at least 6 characters long
                  </div>
                </div>
                
                <div className="form-control w-full space-y-2">
                  <label className="label">
                    <span className="label-text">Confirm New Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="input input-bordered w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                
                <button 
                  className="btn btn-primary w-full" 
                  type="submit" 
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                </button>
                
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Remembered your password?{" "}
                    <a href="/login" className="text-primary hover:underline">
                      Go to login
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Image Side */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src={img} alt="img" className="w-full h-full" />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Reset your password securely
              </h2>
              <p className="opacity-70">
                Choose a strong password to keep your account secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;