import * as z from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Vui lòng nhập họ và tên")
      .min(2, "Họ và tên phải ít nhất 2 ký tự")
      .trim(),

    email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),

    password: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu phải ít nhất 6 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"
      ),

    confirm_password: z.string().min(1, "Vui lòng nhập xác nhận mật khẩu"),

    dateOfBirth: z
      .string()
      .min(1, "Vui lòng chọn ngày sinh")
      .refine((date) => {
        const birth = new Date(date);
        const age = new Date().getFullYear() - birth.getFullYear();
        return age >= 13;
      }, "Bạn phải từ 13 tuổi trở lên"),

    phone: z
      .string()
      .min(1, "Vui lòng nhập số điện thoại")
      .refine(
        (phone) => /^(\+84|0)[3-9]\d{8}$/.test(phone.replace(/\s/g, "")),
        {
          message: "Số điện thoại không hợp lệ",
        }
      ),

    address: z
      .string()
      .min(1, "Vui lòng nhập địa chỉ")
      .min(5, "Địa chỉ không hợp lệ"),

    roleName: z.enum(["student", "teacher"], {
      message: "Vui lòng chọn vai trò",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
  });
