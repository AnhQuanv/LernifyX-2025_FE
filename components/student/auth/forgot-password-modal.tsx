"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X, Mail, KeyRound } from "lucide-react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({
    general: "",
    email: "",
    code: "",
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
      setErrors((prev) => ({ ...prev, email: "Email không được để trống" }));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Email không hợp lệ" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validateCode = () => {
    if (!code) {
      setErrors((prev) => ({
        ...prev,
        code: "Mã xác thực không được để trống",
      }));
      return false;
    }
    if (code.length !== 6) {
      setErrors((prev) => ({ ...prev, code: "Mã xác thực phải có 6 số" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, code: "" }));
    return true;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ general: "", email: "", code: "" });

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const random = Math.random();
      if (random < 0.2) {
        setErrors((prev) => ({
          ...prev,
          general: "Email không tồn tại trong hệ thống",
        }));
      } else if (random < 0.3) {
        setErrors((prev) => ({
          ...prev,
          general: "Lỗi kết nối. Vui lòng thử lại sau.",
        }));
      } else {
        setStep("code");
        setTimeLeft(300); // 5 phút
        setCanResend(false);
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Đã có lỗi xảy ra. Vui lòng thử lại.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ general: "", email: "", code: "" });

    if (!validateCode()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const random = Math.random();
      if (random < 0.3) {
        setErrors((prev) => ({
          ...prev,
          general: "Mã xác thực không chính xác",
        }));
      } else if (random < 0.4) {
        setErrors((prev) => ({
          ...prev,
          general: "Mã xác thực đã hết hạn",
        }));
      } else {
        setStep("success");
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Đã có lỗi xảy ra. Vui lòng thử lại.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setCode("");
    setErrors({ general: "", email: "", code: "" });
    setIsLoading(false);
    setTimeLeft(0);
    setCanResend(true);
    onClose();
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setCanResend(false);
    setTimeLeft(300); // Reset timer to 5 minutes

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setErrors({ general: "", email: "", code: "" });
      setCode(""); // Clear current code

      // Show success toast
      const toast = document.createElement("div");
      toast.className =
        "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-[60] animate-in slide-in-from-right-5";
      toast.textContent = "Mã xác thực đã được gửi lại!";
      document.body.appendChild(toast);

      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 3000);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Không thể gửi lại mã. Vui lòng thử lại.",
      }));
      setCanResend(true);
      setTimeLeft(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
            {step === "email" && <Mail className="h-6 w-6 text-indigo-600" />}
            {step === "code" && (
              <KeyRound className="h-6 w-6 text-indigo-600" />
            )}
            {step === "success" && (
              <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {step === "email" && "Quên mật khẩu?"}
            {step === "code" && "Nhập mã xác thực"}
            {step === "success" && "Thành công!"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {step === "email" && "Nhập email để nhận mã xác thực"}
            {step === "code" && `Mã xác thực đã được gửi đến ${email}`}
            {step === "success" &&
              "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn"}
          </p>
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

        {/* Email Step */}
        {step === "email" && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Nhập email của bạn"
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
                    Đang gửi...
                  </div>
                ) : (
                  "Gửi mã xác thực"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full"
              >
                Hủy
              </Button>
            </div>
          </form>
        )}

        {/* Code Step */}
        {step === "code" && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Mã xác thực</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Nhập mã 6 số"
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

            {/* Timer and Resend Section */}
            <div className="text-center space-y-2">
              {timeLeft > 0 && (
                <p className="text-sm text-gray-500">
                  Mã sẽ hết hạn sau:{" "}
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
                  ? "Gửi lại mã xác thực"
                  : `Gửi lại sau ${formatTime(timeLeft)}`}
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
                    Đang xác thực...
                  </div>
                ) : (
                  "Xác thực"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("email")}
                className="w-full"
              >
                Quay lại
              </Button>
            </div>
          </form>
        )}

        {/* Success Step */}
        {step === "success" && (
          <div className="space-y-4">
            <div className="text-center text-sm text-gray-600">
              Vui lòng kiểm tra email và làm theo hướng dẫn để đặt lại mật khẩu.
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Đóng
            </Button>
          </div>
        )}

        {/* Security Note - only show in code step */}
        {step === "code" && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-medium mb-1">Lưu ý bảo mật</p>
                <p>
                  Không chia sẻ mã xác thực với bất kỳ ai. Mã sẽ hết hạn sau 5
                  phút.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
