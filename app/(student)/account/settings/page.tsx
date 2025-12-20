"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2, Eye, EyeOff, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleChangePassword } from "@/services/authService";
import axios from "axios";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(6, "Mật khẩu phải ít nhất 6 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ cái viết hoa")
      .regex(/[0-9]/, "Mật khẩu phải có ít nhất một số")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Mật khẩu phải có ít nhất một ký tự đặc biệt"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function AccountSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await handleChangePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      setSuccessMessage(res.message || "Đổi mật khẩu thành công!");
      form.reset();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: unknown) {
      console.error("Lỗi khi cập nhật mật khẩu:", error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại";
        setErrorMessage(message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Đã có lỗi xảy ra, vui lòng thử lại");
      }
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white text-gray-900 py-8 shadow-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Cài đặt tài khoản</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-900">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-linear-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-white" />{" "}
              </div>
              <div>
                <p className="font-semibold text-red-900">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Change Password Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
              Đổi mật khẩu
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onPasswordSubmit)}
                className="space-y-6"
              >
                {/* Current Password */}
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Mật khẩu hiện tại
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPasswords.current ? "text" : "password"}
                            placeholder="Nhập mật khẩu hiện tại"
                            className="pr-12 h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500/20"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords((prev) => ({
                                ...prev,
                                current: !prev.current,
                              }))
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.current ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Mật khẩu mới
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPasswords.new ? "text" : "password"}
                            placeholder="Nhập mật khẩu mới"
                            className="pr-12 h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500/20"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords((prev) => ({
                                ...prev,
                                new: !prev.new,
                              }))
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.new ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Xác nhận mật khẩu
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPasswords.confirm ? "text" : "password"}
                            placeholder="Xác nhận mật khẩu mới"
                            className="pr-12 h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500/20"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords((prev) => ({
                                ...prev,
                                confirm: !prev.confirm,
                              }))
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.confirm ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-800 mb-2">
                    Yêu cầu mật khẩu:
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ít nhất 6 ký tự</li>
                    <li>• Có ít nhất một chữ cái viết hoa</li>
                    <li>• Có ít nhất một số</li>
                    <li>• Có ít nhất một ký tự đặc biệt</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin " />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>Đổi Mật Khẩu</>
                  )}
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
