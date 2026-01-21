"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { IUser } from "@/types/api/auth";
import { register } from "@/services/authService";
import toast from "react-hot-toast";
import { updateProfile } from "@/redux/thunk/authThunk";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

const userFormSchema = z
  .object({
    fullName: z.string().min(1, "Họ tên là bắt buộc"),
    email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
    password: z.string().optional(),
    confirm_password: z.string().optional(),
    dateOfBirth: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    roleName: z.enum(["student", "teacher", "admin"]),
    bio: z.string().max(80, "Tiểu sử không quá 80 ký tự").optional(),
    description: z.string().max(1000, "Mô tả không quá 1000 ký tự").optional(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.confirm_password) {
        return false;
      }
      return true;
    },
    {
      message: "Mật khẩu xác nhận không khớp",
      path: ["confirm_password"],
    },
  );

interface AddStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  user: IUser | null;
  type: "add" | "update";
}

export function AddStudentModal({
  open,
  onOpenChange,
  onSubmit,
  user,
  type,
}: AddStudentModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      roleName: "student",
      bio: "",
      description: "",
      address: "",
      password: "",
      confirm_password: "",
      isActive: false,
    },
  });

  const selectedRole = form.watch("roleName");
  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || user.fullName || "",
        email: user.email || "",
        password: "",
        confirm_password: "",
        dateOfBirth: user.dateOfBirth || "",
        phone: user.phone || "",
        address: user.address || "",
        roleName:
          (user.roleName as "student" | "teacher" | "admin") || "student",
        bio: user.bio || "",
        description: user.description || "",
        isActive: user.isActive || false,
      });
    } else {
      form.reset({
        roleName: "student",
        fullName: "",
        email: "",
        address: "",
        password: "",
        confirm_password: "",
        isActive: false,
      });
    }
  }, [user, form, open]);

  const handleFormSubmit = async (values: z.infer<typeof userFormSchema>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirm_password, bio, description, ...cleanData } = values;

    const formattedData = {
      ...cleanData,
      ...(values.roleName === "teacher" ? { bio, description } : {}),
      address: values.address || undefined,
      phone: values.phone || undefined,
      dateOfBirth: values.dateOfBirth || undefined,
    };

    try {
      if (type === "add") {
        const registerData = {
          ...formattedData,
          password: values.password || "123456",
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await register(registerData as any);
        toast.success("Thêm tài khoản mới thành công!");
      } else {
        const updateData = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          userId: user?.userId || (user as any)?.id,
          ...formattedData,
        };

        if (!values.password) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          delete (updateData as any).password;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await dispatch(updateProfile(updateData as any)).unwrap();
        toast.success("Cập nhật tài khoản thành công!");
      }

      onSubmit();
      onOpenChange(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message;
      if (msg.toLowerCase().includes("email")) {
        form.setError("email", { message: "Email này đã được sử dụng" });
      }
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black">
            {user ? "Cập nhật tài khoản" : "Tạo tài khoản"}
          </DialogTitle>
          <DialogDescription>
            {user
              ? "Lưu ý: Bạn không thể thay đổi vai trò của tài khoản đã tồn tại."
              : "Điền thông tin để tạo người dùng mới."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 py-2"
          >
            {/* Vai trò (Khóa khi sửa) */}
            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-black">
                    Vai trò hệ thống
                  </FormLabel>
                  <div
                    className={`flex flex-wrap gap-4 mt-2 p-3 rounded-xl border ${
                      user
                        ? "bg-gray-100 border-gray-200"
                        : "bg-indigo-50/50 border-indigo-100"
                    }`}
                  >
                    {["student", "teacher", "admin"].map((role) => (
                      <label
                        key={role}
                        className={`flex items-center gap-2 ${
                          user
                            ? "cursor-not-allowed opacity-70"
                            : "cursor-pointer"
                        } group`}
                      >
                        <input
                          type="radio"
                          className="accent-black w-4 h-4"
                          value={role}
                          checked={field.value === role}
                          onChange={() => !user && field.onChange(role)}
                          disabled={!!user}
                        />
                        <span className="text-sm font-medium">
                          {role === "student"
                            ? "Học viên"
                            : role === "teacher"
                              ? "Giảng viên"
                              : "Quản trị viên"}
                        </span>
                      </label>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            {/* Họ tên & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-gray-50" />
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
                        className="bg-gray-50"
                        disabled={!!user}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedRole === "teacher" && (
              <div className="space-y-4 p-4 bg-amber-50/30 border border-amber-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiểu sử ngắn (Max 80 ký tự)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Vd: Giảng viên CNTT với 5 năm kinh nghiệm..."
                          className="bg-white"
                        />
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
                      <FormLabel>Mô tả chi tiết</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Chi tiết kỹ năng giảng dạy..."
                          className="bg-white min-h-25"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Mật khẩu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {user ? "Mật khẩu mới (nếu muốn đổi)" : "Mật khẩu"}
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="pr-10 bg-gray-100"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 "
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
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="pr-10 bg-gray-100"
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

            {/* Ngày sinh & Điện thoại */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-gray-50" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-50"
                        placeholder="Nhập số điện thoại"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          className="bg-gray-50 pl-9"
                          placeholder="Nhập địa chỉ"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-black">
                      Xác thực Email
                    </FormLabel>
                    <div className="flex gap-4 mt-2 p-3 rounded-xl border bg-gray-50/50 border-gray-100">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          className="accent-black w-4 h-4"
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                        />
                        <span
                          className={`text-sm font-medium flex items-center gap-1 ${
                            field.value ? "text-black" : "text-zinc-500"
                          }`}
                        >
                          Đã xác thực
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          className="accent-black w-4 h-4"
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                        />
                        <span
                          className={`text-sm font-medium flex items-center gap-1 ${
                            !field.value ? "text-black" : "text-zinc-500"
                          }`}
                        >
                          Chưa xác thực
                        </span>
                      </label>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-black hover:bg-zinc-800 text-white rounded-xl px-10 cursor-pointer"
              >
                {user ? "Lưu thay đổi" : "Tạo tài khoản"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
