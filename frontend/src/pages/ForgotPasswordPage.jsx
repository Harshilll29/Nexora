import React, { useState } from "react";
import { LoaderPinwheel } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import img from "../imgs/signupimg.png";
import { toast } from "react-hot-toast";
import { forgotPassword } from "../lib/api";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");


  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent successfully");
      setOtpSent(true);
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to send OTP";
      toast.error(msg);
      console.error(error);
    }
  });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    
    forgotPasswordMutation.mutate(email);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");
    if (otp.length !== 6) return toast.error("OTP must be 6 digits");
    
    
    navigate("/reset-password", { 
      state: { 
        email,
        otp,
        verified: true 
      } 
    });
  };

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
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Forgot Password?</h2>
                  <p className="text-sm opacity-70">
                    {otpSent 
                      ? "Enter the OTP sent to your email to proceed." 
                      : "Enter your email to receive an OTP and reset your password."
                    }
                  </p>
                </div>
                
                <div className="form-control w-full space-y-2">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    className="input input-bordered w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpSent}
                    required
                  />
                </div>

                {otpSent && (
                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">OTP</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      className="input input-bordered w-full"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      required
                    />
                  </div>
                )}

                <button 
                  className="btn btn-primary w-full" 
                  type="submit"
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending ? "Sending..." : (otpSent ? "Verify OTP" : "Send OTP")}
                </button>

                {otpSent && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      Change email address
                    </button>
                  </div>
                )}

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Remembered your password?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Go to login
                    </Link>
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
                {otpSent 
                  ? "Verify the OTP sent to your email to continue"
                  : "We'll send you a one-time OTP to verify your identity"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;