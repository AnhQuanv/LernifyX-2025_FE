"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { register } from "@/services/authService";
import { EmailVerificationModal } from "./verify";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [showVerify, setShowVerify] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm_password: "",
    address: "",
    phone: "",
    dateOfBirth: "",
  });
  const [errors, setErrors] = useState({
    general: "",
    fullName: "",
    email: "",
    password: "",
    confirm_password: "",
    address: "",
    phone: "",
    dateOfBirth: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      general: "",
      fullName: "",
      email: "",
      password: "",
      confirm_password: "",
      address: "",
      phone: "",
      dateOfBirth: "",
    };

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ tên không được để trống";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Validate confirm password
    if (!formData.confirm_password) {
      newErrors.confirm_password = "Xác nhận mật khẩu không được để trống";
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Mật khẩu xác nhận không khớp";
    }

    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
    }

    // Validate phone
    if (!formData.phone) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (
      !/^(\+84|0)[3-9]\d{8}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    // Validate date of birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Ngày sinh không được để trống";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.dateOfBirth = "Tuổi phải từ 13 trở lên";
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({
      general: "",
      fullName: "",
      email: "",
      password: "",
      confirm_password: "",
      address: "",
      phone: "",
      dateOfBirth: "",
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirm_password, ...submitData } = formData;
    const finalData = { ...submitData, roleName: role };

    try {
      await register(finalData);

      setRegisteredEmail(formData.email);
      setShowVerify(true);

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirm_password: "",
        address: "",
        phone: "",
        dateOfBirth: "",
      });
      setRole("student");
    } catch (err: any) {
      const code = err?.code;
      const message = err?.response?.data?.message || err?.message;

      if (code === 400 && message?.toLowerCase().includes("email")) {
        setErrors((prev) => ({
          ...prev,
          email: "Email này đã được sử dụng",
        }));
      } else if (code === 500) {
        setErrors((prev) => ({
          ...prev,
          general: "Lỗi server. Vui lòng thử lại sau.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-indigo-100 px-4 py-10">
        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl p-10">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
            Create your account
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Join the LeanifyX platform to start your learning journey!
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

          {/* <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className={`bg-gray-100 text-base ${
                    errors.fullName ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`bg-gray-100 text-base pr-10 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : ""
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

              <div className="grid gap-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    className={`bg-gray-100 text-base pr-10 ${
                      errors.confirm_password
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirm_password}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateOfBirth">Birth Date</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className={`bg-gray-100 text-base ${
                  errors.dateOfBirth
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Main St, City"
                value={formData.address}
                onChange={handleChange}
                required
                className={`bg-gray-100 text-base ${
                  errors.address ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.address && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.address}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+84 123 456 789"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`bg-gray-100 text-base ${
                  errors.phone ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label>Registering as</Label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === "student"}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Student
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={role === "teacher"}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Teacher
                  </span>
                </label>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full text-base h-12 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang đăng ký...
                </div>
              ) : (
                "Register"
              )}
            </Button>
          </div> */}

          {/* FORM START */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Họ tên và Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className={`bg-gray-100 text-base ${
                    errors.fullName ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className={`bg-gray-100 text-base ${
                    errors.email ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className={`bg-gray-100 text-base pr-10 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.password}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className={`bg-gray-100 text-base pr-10 ${
                      errors.confirm_password
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{" "}
                    {errors.confirm_password}
                  </p>
                )}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="grid gap-2">
              <Label htmlFor="dateOfBirth">Birth Date</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                autoComplete="bday"
                className={`bg-gray-100 text-base ${
                  errors.dateOfBirth
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.dateOfBirth}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Main St, City"
                value={formData.address}
                onChange={handleChange}
                required
                autoComplete="street-address"
                className={`bg-gray-100 text-base ${
                  errors.address ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.address && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.address}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+84 123 456 789"
                value={formData.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
                className={`bg-gray-100 text-base ${
                  errors.phone ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="grid gap-3">
              <Label>Registering as</Label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === "student"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Student
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={role === "teacher"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Teacher
                  </span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-base h-12 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 mt-4"
            >
              {isLoading ? "Đang đăng ký..." : "Register"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Button
              variant="link"
              className="text-indigo-600 hover:text-indigo-700 p-0 h-auto text-sm font-semibold"
              onClick={(e) => {
                e.preventDefault();
                alert("Chuyển đến trang đăng nhập");
              }}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
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
