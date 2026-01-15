/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { updateAvatar, updateProfile } from "@/redux/thunk/authThunk";
import { UserAvatar } from "@/components/ui/avatar-cop";
import toast from "react-hot-toast";

const editProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được vượt quá 100 ký tự"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .regex(/^[0-9+\-\s()]*$/, "Định dạng số điện thoại không hợp lệ"),
  dateOfBirth: z.string().refine((date) => {
    if (!date) return true;
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 13;
  }, "Bạn phải ít nhất 13 tuổi để sử dụng dịch vụ"),
  address: z
    .string()
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
    .max(200, "Địa chỉ không được vượt quá 200 ký tự"),
  bio: z.string().max(80, "Tiểu sử không quá 80 ký tự").optional(),
  description: z.string().max(1000, "Mô tả không quá 1000 ký tự").optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export default function EditProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const isTeacher =
    user?.roleName === "teacher" || user?.roleName === "teacher";

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
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
      bio: "",
      description: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        address: user.address || "",
        bio: user.bio || "",
        description: user.description || "",
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
      toast.success("Cập nhật hồ sơ thành công!");
    } catch {
      toast.error("Cập nhật hồ sơ thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarFile) return;
    setIsLoadingAvatar(true);
    try {
      await dispatch(updateAvatar(avatarFile)).unwrap();
      toast.success("Cập nhật ảnh đại diện thành công!");
      setHasAvatarChanged(false);
    } catch {
      toast.error("Cập nhật ảnh đại diện thất bại. Vui lòng thử lại!");
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Avatar Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Ảnh đại diện
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <UserAvatar
                fullName={user?.fullName || "User"}
                avatarUrl={avatarPreview}
                size={128}
              />
              <div className="flex-1 w-full">
                <label className="relative group cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <div className="bg-violet-50 border-2 border-dashed border-violet-200 rounded-2xl p-6 text-center hover:border-violet-400 transition-all">
                    <Upload className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-700 text-sm">
                      Tải ảnh mới lên
                    </p>
                  </div>
                </label>
              </div>
            </div>
            {hasAvatarChanged && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveAvatar}
                  disabled={isLoadingAvatar}
                  className="flex-1 bg-violet-600 text-white py-2 rounded-xl font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {isLoadingAvatar ? "Đang lưu..." : "Lưu ảnh mới"}
                </button>
                <button
                  onClick={() => {
                    setAvatarPreview(user?.avatar || "");
                    setHasAvatarChanged(false);
                  }}
                  className="px-4 py-2 border rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-8">
              Thông tin chi tiết
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input className="pl-12 rounded-xl" {...field} />
                          </div>
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
                          <div className="relative">
                            <Input
                              disabled
                              className="pl-12 rounded-xl bg-gray-50"
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {" "}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input className="pl-12 rounded-xl" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày sinh</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="date"
                              className="pl-12 rounded-xl"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <textarea
                            className="w-full pl-12 pt-3 h-20 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isTeacher && (
                  <>
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Câu giới thiệu ngắn (Bio)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Ví dụ: Chuyên gia giảng dạy tiếng Anh với 10 năm kinh nghiệm"
                                className="pl-12 rounded-xl"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả chi tiết bản thân</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <textarea
                                className="w-full pl-12 pt-3 h-32 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none"
                                placeholder="Chia sẻ thêm về quá trình làm việc, thành tựu..."
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-linear-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
