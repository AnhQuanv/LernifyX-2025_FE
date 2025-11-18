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
            Create your account
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Join the LearnifyX platform to start your learning journey!
          </p>

          {/* Root Error */}
          {formState.errors.root && (
            <p className="text-red-600 text-center mb-4">
              {formState.errors.root.message}
            </p>
          )}

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-gray-100"
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
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="pr-10 bg-gray-100"
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
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                            className="pr-10 bg-gray-100"
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

              {/* Birth Date */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
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

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-100"
                        autoComplete="address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-100"
                        autoComplete="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="roleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registering as</FormLabel>
                    <div className="flex gap-6 mt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="student"
                          checked={field.value === "student"}
                          onChange={() => field.onChange("student")}
                        />
                        Student
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="teacher"
                          checked={field.value === "teacher"}
                          onChange={() => field.onChange("teacher")}
                        />
                        Teacher
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                {formState.isSubmitting ? "Đang đăng ký..." : "Register"}
              </Button>
            </form>
          </Form>

          {/* Already have account */}
          <div className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Button
              variant="link"
              className="text-indigo-600 p-0"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </Button>
          </div>
        </div>
      </div>

      {/* Verify Modal */}
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
