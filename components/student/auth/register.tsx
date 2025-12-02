"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "@/services/authService";
import { EmailVerificationModal } from "./verify";
import { useRouter } from "next/navigation";
import * as z from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Eye, EyeOff } from "lucide-react";
import { registerSchema } from "@/app/schemas/register-schema";

export function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showVerify, setShowVerify] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirm_password: "",
      dateOfBirth: "",
      phone: "",
      address: "",
      roleName: "student",
    },
  });

  const { handleSubmit, setError, formState } = form;

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    const { confirm_password, ...submitData } = values;

    try {
      await register(submitData);

      setRegisteredEmail(values.email);
      setShowVerify(true);

      form.reset();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message;

      if (msg.toLowerCase().includes("email")) {
        setError("email", { message: "Email này đã được sử dụng" });
      } else {
        setError("root", {
          message: msg || "Đã có lỗi xảy ra. Vui lòng thử lại.",
        });
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-100 via-white to-indigo-100 px-4 py-10">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
            Tạo tài khoản
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Tham gia LearnifyX để bắt đầu hành trình học tập của bạn!
          </p>

          {/* Root Error */}
          {formState.errors.root && (
            <p className="text-red-600 text-center mb-4">
              {formState.errors.root.message}
            </p>
          )}

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Họ tên & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-gray-100"
                          placeholder="Nhập họ và tên"
                          autoComplete="name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          className="bg-gray-100"
                          placeholder="Nhập email"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Mật khẩu & Xác nhận mật khẩu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="pr-10 bg-gray-100"
                            placeholder="Nhập mật khẩu"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                            className="pr-10 bg-gray-100"
                            placeholder="Nhập lại mật khẩu"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Ngày sinh */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="bg-gray-100"
                        autoComplete="bday"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Địa chỉ */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-100"
                        placeholder="Nhập địa chỉ"
                        autoComplete="address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Số điện thoại */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-100"
                        placeholder="Nhập số điện thoại"
                        autoComplete="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Vai trò */}
              <FormField
                control={form.control}
                name="roleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đăng ký với vai trò</FormLabel>
                    <div className="flex gap-6 mt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="student"
                          checked={field.value === "student"}
                          onChange={() => field.onChange("student")}
                        />
                        Học viên
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="teacher"
                          checked={field.value === "teacher"}
                          onChange={() => field.onChange("teacher")}
                        />
                        Giảng viên
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nút đăng ký */}
              <Button
                type="submit"
                className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                {formState.isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
            </form>
          </Form>

          {/* Chuyển sang đăng nhập */}
          <div className="text-center text-sm text-gray-500 mt-6">
            Đã có tài khoản?{" "}
            <Button
              variant="link"
              className="text-indigo-600 p-0"
              onClick={() => router.push("/auth/login")}
            >
              Đăng nhập
            </Button>
          </div>
        </div>
      </div>

      {/* Modal xác minh email */}
      <EmailVerificationModal
        isOpen={showVerify}
        onClose={() => setShowVerify(false)}
        email={registeredEmail}
        onSuccess={() => {
          setShowVerify(false);
          router.push("/auth/login");
        }}
      />
    </>
  );
}
