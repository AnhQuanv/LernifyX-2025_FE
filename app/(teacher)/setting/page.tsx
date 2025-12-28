"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Eye, EyeOff, Save, Upload } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar-cop";
import { updateAvatar, updateProfile } from "@/redux/thunk/authThunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { handleChangePassword } from "@/services/authService";
import toast from "react-hot-toast";

const editProfileSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ").optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(80, "Tiểu sử không được vượt quá 80 ký tự").optional(),
  description: z
    .string()
    .max(1000, "Tiểu sử không được vượt quá 1000 ký tự")
    .optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Mật khẩu hiện tại phải có ít nhất 6 ký tự"),
    newPassword: z
      .string()
      .min(6, "Mật khẩu phải ít nhất 6 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ cái viết hoa")
      .regex(/[0-9]/, "Mật khẩu phải có ít nhất một số")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Mật khẩu phải có ít nhất một ký tự đặc biệt"
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Xác nhận mật khẩu không khớp",
    path: ["confirmNewPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [avatarPreview, setAvatarPreview] = useState("/placeholder.svg");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [hasAvatarChanged, setHasAvatarChanged] = useState(false);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);

  const defaultProfileValues: EditProfileFormValues = {
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    bio: "",
    description: "",
  };

  const profileForm = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: defaultProfileValues,
    mode: "onChange",
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onChange",
  });

  const { isSubmitting: isSubmittingProfile } = profileForm.formState;
  const { isSubmitting: isSubmittingPassword } = passwordForm.formState;
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        address: user.address || "",
        bio: user.bio || "",
        description: user.description || "",
      });
      setAvatarPreview(user.avatar || "/placeholder.svg");
    }
  }, [user, profileForm]);

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

  const handleSaveAvatar = async () => {
    if (!avatarFile) return;
    setIsLoadingAvatar(true);

    try {
      await dispatch(updateAvatar(avatarFile)).unwrap();
      toast.success("Cập nhật ảnh đại diện thành công!", {
        duration: 4000,
      });
      setHasAvatarChanged(false);
      setAvatarFile(null);
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error(
        "Đã xảy ra lỗi khi cập nhật ảnh đại diện. Vui lòng thử lại!",
        {
          duration: 4000,
        }
      );
    } finally {
      setIsLoadingAvatar(false);
    }
  };

  const handleCancelAvatar = () => {
    setAvatarPreview(user?.avatar || "/placeholder.svg");
    setAvatarFile(null);
    setHasAvatarChanged(false);
  };

  const onSubmitProfile = async (values: EditProfileFormValues) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, ...profileData } = values;
      await dispatch(updateProfile(profileData)).unwrap();
      toast.success("Cập nhật hồ sơ thành công!", {
        duration: 4000,
      });
      profileForm.reset(values);
    } catch {
      toast.error("Đã xảy ra lỗi khi cập nhật hồ sơ. Vui lòng thử lại!", {
        duration: 4000,
      });
    }
  };

  const onSubmitPassword = async (values: ChangePasswordFormValues) => {
    try {
      await handleChangePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Mật khẩu đã được đổi thành công!", { duration: 4000 });
      passwordForm.reset();
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại!", {
        duration: 4000,
      });
    }
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cài Đặt</h1>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger className="cursor-pointer" value="profile">
              Hồ Sơ
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="password">
              Đổi Mật Khẩu
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin hồ sơ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    Ảnh đại diện
                  </h2>

                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    {/* Avatar Display */}
                    <div className="shrink-0">
                      <UserAvatar
                        fullName={profileForm.getValues("fullName") || "User"}
                        avatarUrl={avatarPreview}
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
                        <div className="bg-linear-to-r from-violet-50 to-purple-50 border-2 border-dashed border-violet-300 rounded-2xl p-6 text-center hover:border-violet-500 hover:bg-violet-100/50 transition-all duration-300 group-hover:shadow-lg">
                          <Upload className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                          <p className="font-semibold text-gray-800">
                            Tải ảnh mới
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Buttons to Save/Cancel Avatar */}
                  {hasAvatarChanged && (
                    <div className="flex gap-4 pt-6 border-t border-gray-100 mt-6">
                      <button
                        type="button"
                        onClick={handleCancelAvatar}
                        className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                        disabled={isLoadingAvatar}
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAvatar}
                        disabled={isLoadingAvatar}
                        className="flex-1 px-6 py-3 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoadingAvatar ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Đang Lưu...
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

                {/* Profile Form */}
                <form
                  onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName">Họ Tên</Label>
                    <Input
                      id="fullName"
                      {...profileForm.register("fullName")}
                      disabled={isSubmittingProfile}
                    />
                    {profileForm.formState.errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...profileForm.register("email")}
                        disabled
                      />
                      {profileForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Số Điện Thoại</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...profileForm.register("phone")}
                        disabled={isSubmittingProfile}
                      />
                      {profileForm.formState.errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {profileForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date of Birth & Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Ngày Sinh</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        {...profileForm.register("dateOfBirth")}
                        disabled={isSubmittingProfile}
                      />
                      {profileForm.formState.errors.dateOfBirth && (
                        <p className="text-red-500 text-sm mt-1">
                          {profileForm.formState.errors.dateOfBirth.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="address">Địa Chỉ</Label>
                      <Input
                        id="address"
                        {...profileForm.register("address")}
                        disabled={isSubmittingProfile}
                      />
                      {profileForm.formState.errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {profileForm.formState.errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <Label htmlFor="bio">Tiểu sử ngắn</Label>
                    <Textarea
                      id="bio"
                      placeholder="Ví dụ: Chuyên gia đào tạo React với 5 năm kinh nghiệm..."
                      {...profileForm.register("bio")}
                      rows={2}
                      disabled={isSubmittingProfile}
                    />
                    {profileForm.formState.errors.bio && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileForm.formState.errors.bio.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Giới thiệu chi tiết</Label>
                    <Textarea
                      id="description"
                      placeholder="Hãy kể về quá trình làm việc, thành tựu và phương pháp giảng dạy của bạn..."
                      {...profileForm.register("description")}
                      rows={6}
                      disabled={isSubmittingProfile}
                    />
                    {profileForm.formState.errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full md:w-auto cursor-pointer"
                    disabled={
                      !profileForm.formState.isDirty || isSubmittingProfile
                    }
                  >
                    {isSubmittingProfile ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Đang Lưu...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu Thay Đổi
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Đổi Mật Khẩu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form
                  onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                  className="space-y-4"
                >
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mật Khẩu Hiện Tại</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        placeholder="Nhập mật khẩu hiện tại"
                        className="pr-12 h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500/20"
                        {...passwordForm.register("currentPassword")}
                        disabled={isSubmittingPassword}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Hiển thị lỗi từ Form State */}
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  {/* New Password & Confirm */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Mật Khẩu Mới</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          // Sử dụng showPasswords.new để điều khiển loại input
                          type={showPasswords.new ? "text" : "password"}
                          placeholder="Nhập mật khẩu mới"
                          className="pr-12 h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500/20"
                          {...passwordForm.register("newPassword")}
                          disabled={isSubmittingPassword}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              new: !prev.new, // Đảo trạng thái hiển thị của mật khẩu mới
                            }))
                          }
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmNewPassword">
                          Xác Nhận Mật Khẩu Mới
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmNewPassword"
                            // Sử dụng showPasswords.confirm để điều khiển hiển thị
                            type={showPasswords.confirm ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu mới"
                            className="pr-12 h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500/20"
                            {...passwordForm.register("confirmNewPassword")}
                            disabled={isSubmittingPassword}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords((prev) => ({
                                ...prev,
                                confirm: !prev.confirm,
                              }))
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                          >
                            {showPasswords.confirm ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        {passwordForm.formState.errors.confirmNewPassword && (
                          <p className="text-red-500 text-sm mt-1">
                            {
                              passwordForm.formState.errors.confirmNewPassword
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
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
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={
                      !passwordForm.formState.isValid || isSubmittingPassword
                    }
                  >
                    {isSubmittingPassword ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Đang cập nhật...
                      </>
                    ) : (
                      <>Đổi Mật Khẩu</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
