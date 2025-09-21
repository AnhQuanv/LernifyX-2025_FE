"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { ForgotPasswordModal } from "./forgot-password-modal";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginAsync } from "@/redux/thunk/authThunk";
import { AppDispatch } from "@/redux/store";
import { EmailVerificationModal } from "./verify";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    general: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const validateForm = () => {
    const newErrors = {
      general: "",
      email: "",
      password: "",
    };

    // Validate email
    if (!email) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ general: "", email: "", password: "" });

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await dispatch(loginAsync({ email, password })).unwrap();
      router.push("/homepage");
    } catch (err: unknown) {
      if (typeof err === "string") {
        setErrors((prev) => ({ ...prev, general: err }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Đã có lỗi xảy ra. Vui lòng thử lại.",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };
  const clearError = (field: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-4 py-10">
        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-xl p-10">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
            Welcome
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Login to continue learning with LeanifyX
          </p>

          {/* General Error Alert */}
          {errors.general && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {errors.general}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) clearError("email");
                }}
                required
                autoComplete="email"
                className={`bg-gray-100 text-base ${
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

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) clearError("password");
                  }}
                  required
                  autoComplete="current-password"
                  className={`bg-gray-100 text-base pr-10 ${
                    errors.password ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                variant="link"
                className="text-indigo-500 hover:text-indigo-600 p-0 h-auto text-sm cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotPasswordModal(true);
                }}
              >
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="w-full text-base h-12 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                "Login"
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Button
                variant="link"
                className="text-indigo-600 hover:text-indigo-700 p-0 h-auto text-sm cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/auth/register");
                }}
              >
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />

      <EmailVerificationModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        email="banh@gmail.com"
        onSuccess={() => {}}
      />
    </>
  );
}
