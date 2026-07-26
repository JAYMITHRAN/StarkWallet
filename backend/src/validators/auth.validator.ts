import { z } from "zod";

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be under 72 characters"); // bcrypt's practical limit

export const createPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  password: passwordField,
});

export type CreatePasswordInput = z.infer<typeof createPasswordSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
