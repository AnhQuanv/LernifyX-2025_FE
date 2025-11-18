"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X, Mail, Lock, CheckCircle } from "lucide-react";
import {
  handlePasswordForget,
  handleResetPassword,
} from "@/services/authService";
import { ResetPasswordDto } from "@/types/api/auth";

// Define the steps: email -> code (OTP & New Password combined) -> success
type ForgotPasswordStep = "email" | "code" | "success";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    general: "",
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Countdown timer for resend
  useEffect(() => {
    if (timeLeft <= 0 || step !== "code") {
      if (timeLeft <= 0) setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const validateEmail = () => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  // Validate both OTP code and New Password fields
  const validateCodeAndPassword = () => {
    let isValid = true;
    setErrors((prev) => ({
      ...prev,
      general: "",
      code: "",
      password: "",
      confirmPassword: "",
    }));

    if (!code) {
      setErrors((prev) => ({
        ...prev,
        code: "Verification code is required",
      }));
      isValid = false;
    } else if (code.length !== 6) {
      setErrors((prev) => ({ ...prev, code: "Code must be 6 digits" }));
      isValid = false;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Confirmation password does not match",
      }));
      isValid = false;
    }

    return isValid;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      general: "",
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    });

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    try {
      await handlePasswordForget(email);
      setStep("code");
      setTimeLeft(300);
      setCanResend(false);
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        general: err?.response?.data?.message || "Failed to send code",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      general: "",
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    });

    if (!validateCodeAndPassword()) {
      return;
    }

    setIsLoading(true);

    try {
      const dto: ResetPasswordDto = {
        email,
        codeId: Number(code),
        newPassword,
        confirmPassword,
      };
      await handleResetPassword(dto); // gọi API thật
      setStep("success");
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        general: err?.response?.data?.message || "Failed to reset password",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setCanResend(false);
    setTimeLeft(300); // Reset timer to 5 minutes

    try {
      await handlePasswordForget(email); // gọi API resend code
      setErrors({
        general: "",
        email: "",
        code: "",
        password: "",
        confirmPassword: "",
      });
      setCode("");
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        general: err?.response?.data?.message || "Could not resend code",
      }));
      setCanResend(true);
      setTimeLeft(0);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Modal Close Logic ---

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({
      general: "",
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    });
    setIsLoading(false);
    setTimeLeft(0);
    setCanResend(true);
    onClose();
  };

  if (!isOpen) return null;

  // --- Render Logic ---

  // Icon displayed based on step
  const renderIcon = () => {
    if (step === "email") return <Mail className="h-6 w-6 text-indigo-600" />;
    if (step === "code") return <Lock className="h-6 w-6 text-indigo-600" />; // Use Lock icon for the reset step
    if (step === "success")
      return (
        <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="h-4 w-4 text-white" />
        </div>
      );
    return null;
  };

  // Header title displayed based on step
  const renderTitle = () => {
    if (step === "email") return "Forgot Password?";
    if (step === "code") return "Verify & Set New Password";
    if (step === "success") return "Success!";
    return "";
  };

  // Description displayed based on step
  const renderDescription = () => {
    if (step === "email")
      return "Enter your email to receive a verification code.";
    if (step === "code")
      return `Enter the code sent to ${email} and your new password.`;
    if (step === "success")
      return "Your password has been successfully updated.";
    return "";
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            {renderIcon()}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {renderTitle()}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{renderDescription()}</p>
        </div>

        {/* General Error Alert */}
        {errors.general && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {errors.general}
            </AlertDescription>
          </Alert>
        )}

        {/* Step: Email */}
        {step === "email" && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={`${
                  errors.email ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Verification Code"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Step: Code (Combined OTP & Password) */}
        {step === "code" && (
          <form onSubmit={handleResetPasswordStep} className="space-y-4">
            {/* 1. Verification Code (OTP) */}
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code (OTP)</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setCode(value);
                  if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
                }}
                className={`text-center text-lg tracking-widest ${
                  errors.code ? "border-red-500 focus:border-red-500" : ""
                }`}
                maxLength={6}
              />
              {errors.code && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.code}
                </p>
              )}
            </div>

            {/* 2. New Password */}
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="New password (min 6 characters)"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={`${
                  errors.password ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* 3. Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                className={`${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Timer and Resend Section */}
            <div className="text-center space-y-2 pt-2">
              {timeLeft > 0 && (
                <p className="text-sm text-gray-500">
                  Code expires in:{" "}
                  <span className="font-mono font-semibold text-red-600">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              )}

              <button
                type="button"
                onClick={handleResendCode}
                disabled={!canResend || isLoading}
                className="text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {canResend
                  ? "Resend Code"
                  : `Resend in ${formatTime(timeLeft)}`}
              </button>
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Resetting Password...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("email")}
                className="w-full"
              >
                Back
              </Button>
            </div>
          </form>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="space-y-4">
            <div className="text-center text-sm text-gray-600">
              Your password has been successfully reset. You can now log in with
              your new password.
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Close
            </Button>
          </div>
        )}

        {/* Security Note - only show in code step */}
        {step === "code" && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-medium mb-1">Security Note</p>
                <p>
                  Do not share this verification code with anyone. The code will
                  expire in 5 minutes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
