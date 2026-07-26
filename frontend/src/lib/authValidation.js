import { z } from "zod";
export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be under 72 characters");
export const createPasswordFormSchema = z
    .object({
    password: passwordSchema,
    confirmPassword: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export const loginFormSchema = z.object({
    password: z.string().min(1, "Enter your password"),
});
