"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { getLocale } from "next-intl/server";
import { auth, signIn, signOut } from "@/auth";
import { redirect } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";

export type ActionState = {
  error?: string;
  success?: boolean;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isStrongPassword(password: string) {
  return password.length >= 8;
}

export async function signup(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const team = String(formData.get("team") ?? "").trim() || null;
  const password = String(formData.get("password") ?? "");

  if (!firstName || !lastName || !email || !password) {
    return { error: "missing_fields" };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { error: "invalid_email" };
  }
  if (!isStrongPassword(password)) {
    return { error: "password_too_short" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "email_exists" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      team,
      passwordHash,
      status: "ACTIVE",
    },
  });

  return redirect({ href: "/login", locale: await getLocale() });
}

export async function login(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "invalid_credentials" };
    }
    throw error;
  }

  return redirect({ href: "/", locale: await getLocale() });
}

export async function logout(): Promise<void> {
  await signOut({ redirect: false });
  return redirect({ href: "/", locale: await getLocale() });
}

export async function changePassword(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "not_authenticated" };
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword !== confirmPassword) {
    return { error: "mismatch" };
  }
  if (!isStrongPassword(newPassword)) {
    return { error: "too_short" };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return { error: "generic" };
  }

  const currentValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!currentValid) {
    return { error: "wrong_current" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return { success: true };
}
