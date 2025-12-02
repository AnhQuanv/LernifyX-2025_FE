"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  Upload,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { updateAvatar, updateProfile } from "@/redux/thunk/authThunk";
import { UserAvatar } from "@/components/ui/avatar-cop";

const editProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .regex(/^[0-9+\-\s()]*$/, "Invalid phone number format"),
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age >= 13;
  }, "You must be at least 13 years old"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters"),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export default function EditProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successMessageAvatar, setSuccessMessageAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/placeholder.svg");
  const [hasAvatarChanged, setHasAvatarChanged] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        address: user.address || "",
      });
      setAvatarPreview(user.avatar || "/placeholder.svg");
      setHasAvatarChanged(false);
    }
  }, [user, form]);

  const onSubmit = async (data: EditProfileFormValues) => {
    setIsLoading(true);
    try {
      const { email, ...profileData } = data;
      await dispatch(updateProfile(profileData)).unwrap();
      setSuccessMessage("Cập nhật hồ sơ thành công!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarFile) return;
    setIsLoadingAvatar(true);
    try {
      await dispatch(updateAvatar(avatarFile)).unwrap();
      setSuccessMessageAvatar("Cập nhật ảnh đại diện thành công!");
      setHasAvatarChanged(false);
      setTimeout(() => setSuccessMessageAvatar(""), 3000);
    } catch (error) {
      console.error("Error updating avatar:", error);
    } finally {
      setIsLoadingAvatar(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setHasAvatarChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/account/edit");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
              <h1 className="text-3xl font-bold">Chỉnh sửa hồ sơ</h1>
              <p className="text-gray-500 text-sm">
                Cập nhật thông tin cá nhân
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message for Form */}
          {successMessage && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-900">{successMessage}</p>
                <p className="text-sm text-green-700">
                  Thay đổi của bạn đã được lưu
                </p>
              </div>
            </div>
          )}

          {/* Success Message for Avatar */}
          {successMessageAvatar && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-900">
                  {successMessageAvatar}
                </p>
                <p className="text-sm text-green-700">
                  Ảnh đại diện của bạn đã được cập nhật
                </p>
              </div>
            </div>
          )}

          {/* Avatar Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              Ảnh đại diện
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Avatar Display */}
              <div className="flex-shrink-0">
                <UserAvatar
                  fullName={user?.fullName || "User"}
                  avatarUrl={avatarPreview} // nếu avatarPreview là null/undefined thì sẽ tự fallback
                  size={128}
                />
              </div>

              {/* Upload Section */}
              <div className="flex-1">
                <label className="relative group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-dashed border-violet-300 rounded-2xl p-6 text-center hover:border-violet-500 hover:bg-violet-100/50 transition-all duration-300 group-hover:shadow-lg">
                    <Upload className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-800">Tải ảnh mới</p>
                    <p className="text-sm text-gray-600 mt-1">
                      PNG, JPG tối đa 5MB
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Kích thước khuyên dùng:{" "}
                      <span className="font-medium">256×256px</span> hoặc lớn
                      hơn
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {hasAvatarChanged && (
              <div className="flex gap-4 pt-6 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setAvatarPreview(user?.avatar || "/placeholder.svg");
                    setHasAvatarChanged(false);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  disabled={isLoadingAvatar}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoadingAvatar ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Lưu ảnh
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              Thông tin cá nhân
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Họ và tên
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          <Input
                            placeholder="Nhập họ và tên"
                            className="pl-12 h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500/20"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Địa chỉ Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          <Input
                            disabled
                            type="email"
                            placeholder="Nhập địa chỉ email"
                            className="pl-12 h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500/20"
                            {...field}
                          />
                        </div>
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
                      <FormLabel className="text-gray-700 font-semibold">
                        Số điện thoại
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          <Input
                            placeholder="Nhập số điện thoại"
                            className="pl-12 h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500/20"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date of Birth */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Ngày sinh
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          <Input
                            type="date"
                            className="pl-12 h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500/20"
                            {...field}
                          />
                        </div>
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
                      <FormLabel className="text-gray-700 font-semibold">
                        Địa chỉ
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400 pointer-events-none" />
                          <textarea
                            placeholder="Nhập địa chỉ"
                            className="pl-12 pt-3 h-24 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus:border-violet-500 focus:ring-violet-500/20 focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex gap-4 pt-8 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Form>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
                i
              </div>
              Thông tin quan trọng
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-violet-600 font-bold">•</span>
                <span>
                  Địa chỉ email của bạn được sử dụng để khôi phục tài khoản và
                  nhận thông báo
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-violet-600 font-bold">•</span>
                <span>
                  Số điện thoại giúp chúng tôi liên lạc với bạn về các cập nhật
                  quan trọng
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-violet-600 font-bold">•</span>
                <span>
                  Tất cả thay đổi được lưu ngay sau khi bạn nhấn "Lưu thay đổi"
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
