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

function isStrongPassword(password: string) {
  return password.length >= 8;
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
