import * as z from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters long")
      .trim(),

    email: z.string().email("Invalid email address"),

    password: z.string().min(6, "Password must be at least 6 characters long"),

    confirm_password: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long"),

    dateOfBirth: z.string().refine((date) => {
      const birth = new Date(date);
      const age = new Date().getFullYear() - birth.getFullYear();
      return age >= 13;
    }, "You must be at least 13 years old"),

    phone: z
      .string()
      .refine(
        (phone) => /^(\+84|0)[3-9]\d{8}$/.test(phone.replace(/\s/g, "")),
        {
          message: "Invalid phone number",
        }
      ),

    address: z.string().min(5, "Address is too short"),

    roleName: z.enum(["student", "teacher"], {
      required_error: "Role is required",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });
