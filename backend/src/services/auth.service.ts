import { prisma } from "../lib/prisma.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { HttpError } from "../utils/httpError.js";
import type { CreatePasswordInput, LoginInput } from "../validators/auth.validator.js";

const FAILED_ATTEMPTS_THRESHOLD = 3;
const FAILED_ATTEMPT_DELAY_MS = 1200;

/**
 * StarkMoneyWalletTracker is single-profile: there is exactly one `User`
 * row. "Sign up" therefore means "create the password for the one user",
 * and it is only allowed while no user exists yet.
 */
export const authService = {
  async hasAccount(): Promise<boolean> {
    const count = await prisma.user.count();
    return count > 0;
  },

  async createPassword(input: CreatePasswordInput) {
    const existing = await prisma.user.findFirst();
    if (existing) {
      throw HttpError.conflict("An account already exists. Please log in instead.");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({ data: { passwordHash } });

    await prisma.settings.create({ data: { userId: user.id } });

    return user;
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findFirst();
    if (!user) {
      throw HttpError.notFound("No account found. Please create a password first.");
    }

    const isValid = await verifyPassword(input.password, user.passwordHash);
    if (!isValid) {
      const delay = FAILED_ATTEMPT_DELAY_MS * Math.min(FAILED_ATTEMPTS_THRESHOLD, 3);
      await new Promise((resolve) => setTimeout(resolve, delay));
      throw HttpError.unauthorized("Incorrect password.");
    }

    return user;
  },

  async getById(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw HttpError.notFound("User not found.");
    }
    return user;
  },
};
