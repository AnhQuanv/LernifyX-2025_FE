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
      setErrors((prev) => ({ ...prev, email: "Vui lòng nhập email" }));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Email không hợp lệ" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

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
        code: "Vui lòng nhập mã xác thực",
      }));
      isValid = false;
    } else if (code.length !== 6) {
      setErrors((prev) => ({ ...prev, code: "Mã phải đủ 6 chữ số" }));
      isValid = false;
    }

    if (!newPassword) {
      setErrors((prev) => ({
        ...prev,
        password: "Vui lòng nhập mật khẩu",
      }));
      isValid = false;
    } else if (newPassword.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Mật khẩu phải ít nhất 6 ký tự",
      }));
      isValid = false;
    } else if (!/[A-Z]/.test(newPassword)) {
      setErrors((prev) => ({
        ...prev,
        password: "Mật khẩu phải chứa ít nhất 1 chữ hoa",
      }));
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setErrors((prev) => ({
        ...prev,
        password: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
      }));
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Mật khẩu xác nhận không khớp",
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

    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      await handlePasswordForget(email);
      setStep("code");
      setTimeLeft(300);
      setCanResend(false);
    } catch (err: any) {
      // Lấy dữ liệu từ response (nếu có)
      const data = err?.response?.data;

      let errorMessage = "Gửi mã thất bại"; // default message

      if (data?.errorCode === "INVALID_CODE") {
        errorMessage = "Mã xác thực không đúng. Vui lòng kiểm tra lại.";
      } else if (data?.errorCode === "RESOURCE_NOT_FOUND") {
        errorMessage = "Email không tồn tại. Vui lòng kiểm tra lại.";
      } else if (data?.message) {
        // fallback: lấy message từ backend
        errorMessage = data.message;
      }

      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
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

    if (!validateCodeAndPassword()) return;

    setIsLoading(true);

    try {
      const dto: ResetPasswordDto = {
        email,
        codeId: Number(code),
        newPassword,
        confirmPassword,
      };
      await handleResetPassword(dto);
      setStep("success");
    } catch (err: any) {
      const data = err?.response?.data;
      let errorMessage = "Đặt lại mật khẩu thất bại";

      if (data?.errorCode === "INVALID_CODE") {
        errorMessage = "Mã xác thực không đúng";
      } else if (data?.errorCode === "RESOURCE_NOT_FOUND") {
        errorMessage = "Email không tồn tại";
      } else if (data?.message) {
        errorMessage = data.message;
      }

      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setCanResend(false);
    setTimeLeft(300);

    try {
      await handlePasswordForget(email);
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
        general: err?.response?.data?.message || "Không thể gửi lại mã",
      }));
      setCanResend(true);
      setTimeLeft(0);
    } finally {
      setIsLoading(false);
    }
  };

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

  const renderIcon = () => {
    if (step === "email") return <Mail className="h-6 w-6 text-indigo-600" />;
    if (step === "code") return <Lock className="h-6 w-6 text-indigo-600" />;
    if (step === "success")
      return (
        <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="h-4 w-4 text-white" />
        </div>
      );
    return null;
  };

  const renderTitle = () => {
    if (step === "email") return "Quên mật khẩu?";
    if (step === "code") return "Xác thực & Đặt mật khẩu mới";
    if (step === "success") return "Thành công!";
    return "";
  };

  const renderDescription = () => {
    if (step === "email") return "Nhập email để nhận mã xác thực.";
    if (step === "code")
      return `Nhập mã xác thực đã gửi tới ${email} và đặt mật khẩu mới.`;
    if (step === "success")
      return "Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.";
    return "";
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in-0 zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            {renderIcon()}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {renderTitle()}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{renderDescription()}</p>
        </div>

        {errors.general && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {errors.general}
            </AlertDescription>
          </Alert>
        )}

        {step === "email" && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                autoComplete="email"
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

        {step === "code" && (
          <form onSubmit={handleResetPasswordStep} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Mã xác thực (OTP)</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Nhập mã 6 chữ số"
                value={code}
                autoComplete="one-time-code"
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

            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                value={newPassword}
                autoComplete="new-password"
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

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                autoComplete="new-password"
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

            <div className="text-center space-y-2 pt-2">
              {timeLeft > 0 && (
                <p className="text-sm text-gray-500">
                  Mã hết hạn sau:{" "}
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
                  ? "Gửi lại mã"
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
                    Đang đặt lại mật khẩu...
                  </div>
                ) : (
                  "Đặt lại mật khẩu"
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

        {step === "success" && (
          <div className="space-y-4">
            <div className="text-center text-sm text-gray-600">
              Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập
              với mật khẩu mới.
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Đóng
            </Button>
          </div>
        )}

        {step === "code" && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-medium mb-1">Lưu ý bảo mật</p>
                <p>
                  Không chia sẻ mã xác thực này với bất kỳ ai. Mã sẽ hết hạn sau
                  5 phút.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
