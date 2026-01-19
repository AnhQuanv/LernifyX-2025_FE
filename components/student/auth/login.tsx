"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/app/schemas/login-schema";
import * as z from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { loginAsync } from "@/redux/thunk/authThunk";

import { ForgotPasswordModal } from "./forgot-password-modal";
import { EmailVerificationModal } from "./verify";
import { useRouter } from "next/navigation";
import { setTokenGetter } from "@/lib/axios";
import { handleSendVerifyMail } from "@/services/authService";

export function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [verifyEmail, setVerifyEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, setError, formState } = form;

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const res = await dispatch(loginAsync(values)).unwrap();
      const token = res.accessToken;
      setTokenGetter(() => token);

      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.message;
      const code = err?.errorCode;

      if (code === "INVALID_CREDENTIALS") {
        setError("root", { message: "Email hoặc mật khẩu không đúng." });
      } else if (code === "ACCOUNT_NOT_VERIFIED") {
        setError("root", {
          message: "Tài khoản chưa được kích hoạt. Vui lòng xác minh email.",
        });
        setVerifyEmail(values.email);
        await handleSendVerifyMail(values.email);
        setShowVerify(true);
        setTimeout(() => {
          form.reset();
          form.clearErrors();
        }, 3000);
      } else if (code === "ACCOUNT_DISABLED") {
        setError("root", {
          message:
            "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ learnifyx@gmail.com để được hỗ trợ.",
        });
        setTimeout(() => {
          form.reset();
          form.clearErrors();
        }, 3000);
      } else if (msg?.toLowerCase().includes("email")) {
        setError("email", { message: "Email không tồn tại." });
      } else {
        setError("root", {
          message: msg || "Đã có lỗi xảy ra. Vui lòng thử lại.",
        });
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 via-white to-indigo-200 px-4 py-10">
        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-xl p-10">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
            Chào mừng
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Đăng nhập để tiếp tục học tập với LearnifyX
          </p>

          {/* Root error */}
          {formState.errors.root && (
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <AlertCircle className="h-4 w-4" />
              <p>{formState.errors.root.message}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-100"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="bg-gray-100 pr-10"
                          autoComplete="current-password"
                        />
                      </FormControl>

                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Forgot password */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 text-indigo-500 cursor-pointer"
                  onClick={() => setShowForgotPasswordModal(true)}
                >
                  Quên mật khẩu?
                </Button>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
                disabled={formState.isSubmitting}
              >
                {formState.isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              {/* Register link */}
              <p className="text-center text-sm text-gray-500 mt-4">
                Chưa có tài khoản?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-indigo-600 p-0 cursor-pointer"
                  onClick={() => router.push("/auth/register")}
                >
                  Đăng ký
                </Button>
              </p>
            </form>
          </Form>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />

      <EmailVerificationModal
        isOpen={showVerify}
        onClose={() => setShowVerify(false)}
        email={verifyEmail}
        onSuccess={() => {
          setShowVerify(false);
          router.push("/auth/login");
        }}
      />
    </>
  );
}
