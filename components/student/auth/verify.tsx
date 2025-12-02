"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X, Shield, CheckCircle2 } from "lucide-react";
import { verifyEmail } from "@/services/authService";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSuccess: () => void;
}

export function EmailVerificationModal({
  isOpen,
  onClose,
  email,
  onSuccess,
}: EmailVerificationModalProps) {
  const [step, setStep] = useState<"verify" | "success">("verify");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({
    general: "",
    code: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) {
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
  }, [isOpen, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ general: "", code: "" });

    const numericCode = Number(code.trim());

    if (isNaN(numericCode)) {
      setErrors((prev) => ({
        ...prev,
        general: "Mã xác thực không hợp lệ.",
      }));
      return;
    }
    if (!validateCode()) return;

    setIsLoading(true);

    try {
      await verifyEmail(email, numericCode);
      setStep("success");
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorCode = err?.response?.data?.errorCode;
      const message = err?.response?.data?.message || err?.message;

      switch (errorCode) {
        case "INVALID_CODE":
          setErrors((prev) => ({
            ...prev,
            general: "Mã xác thực không đúng. Vui lòng kiểm tra lại.",
          }));
          break;
        case "EXPIRED_CODE":
          setErrors((prev) => ({
            ...prev,
            general: "Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.",
          }));
          break;
        default:
          setErrors((prev) => ({
            ...prev,
            general: message || "Đã xảy ra lỗi. Vui lòng thử lại.",
          }));
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setCanResend(false);
    setTimeLeft(300);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setErrors({ general: "", code: "" });
      setCode("");

      // Show success message
      const successAlert = document.createElement("div");
      successAlert.className =
        "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-[60] animate-in slide-in-from-right-5";
      successAlert.textContent = "Mã xác thực mới đã được gửi!";
      document.body.appendChild(successAlert);

      setTimeout(() => {
        document.body.removeChild(successAlert);
      }, 3000);
    } catch {
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

  const handleClose = () => {
    setStep("verify");
    setCode("");
    setErrors({ general: "", code: "" });
    setIsLoading(false);
    setTimeLeft(300);
    setCanResend(false);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
    if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in-0 zoom-in-95 duration-300 shadow-2xl">
        {/* Close Button - only show in verify step */}
        {step === "verify" && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full transition-colors hover:cursor-pointer"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            {step === "verify" && (
              <Shield className="h-8 w-8 text-indigo-600" />
            )}
            {step === "success" && (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 ">
            {step === "verify" && "Xác thực email"}
            {step === "success" && "Xác thực thành công!"}
          </h2>
          <div className="text-sm text-gray-600 space-y-1">
            {step === "verify" && (
              <>
                <p>Chúng tôi đã gửi mã xác thực 6 số đến:</p>
                <p className="font-semibold text-gray-900">{email}</p>
                <p className="mt-2">Vui lòng nhập mã để hoàn tất đăng nhập</p>
              </>
            )}
            {step === "success" && (
              <p>Email của bạn đã được xác thực thành công!</p>
            )}
          </div>
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

        {/* Verify Step */}
        {step === "verify" && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="verification-code" className="text-center block">
                Mã xác thực
              </Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="000000"
                value={code}
                onChange={handleInputChange}
                className={`text-center text-2xl font-mono tracking-wider h-14 ${
                  errors.code ? "border-red-500 focus:border-red-500" : ""
                }`}
                maxLength={6}
                autoComplete="one-time-code"
              />
              {errors.code && (
                <p className="text-sm text-red-600 flex items-center justify-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.code}
                </p>
              )}
            </div>

            {/* Timer and Resend */}
            <div className="text-center space-y-2">
              {timeLeft > 0 && (
                <p className="text-sm text-gray-500">
                  Mã sẽ hết hạn sau:{" "}
                  <span className="font-mono font-semibold text-red-600">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              )}

              <div>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={!canResend || isLoading}
                  className="text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium  hover:cursor-pointer "
                >
                  {canResend ? "Gửi lại mã xác thực" : "Gửi lại mã"}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base font-semibold hover:cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xác thực...
                </div>
              ) : (
                "Xác thực email"
              )}
            </Button>
          </form>
        )}

        {/* Success Step */}
        {step === "success" && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                Bạn sẽ được chuyển hướng trong giây lát...
              </p>
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Security Note */}
        {step === "verify" && (
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Bảo mật tài khoản</p>
                <p>
                  Việc xác thực email giúp bảo vệ tài khoản của bạn khỏi truy
                  cập trái phép. Không chia sẻ mã này với bất kỳ ai.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
