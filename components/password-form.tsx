"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { changePassword, type ActionState } from "@/lib/actions/auth";
import {
  buttonClass,
  errorTextClass,
  inputClass,
  labelClass,
  successTextClass,
} from "@/lib/field-styles";

const initialState: ActionState = {};

export function PasswordForm() {
  const t = useTranslations("Me.password");
  const [state, formAction, isPending] = useActionState(
    changePassword,
    initialState
  );

  return (
    <form action={formAction} className="mt-4 space-y-5">
      <div>
        <label htmlFor="currentPassword" className={labelClass}>
          {t("current")}
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="newPassword" className={labelClass}>
          {t("new")}
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          {t("confirm")}
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      {state?.error ? (
        <p className={errorTextClass}>{t(`errors.${state.error}`)}</p>
      ) : null}
      {state?.success ? (
        <p className={successTextClass}>{t("success")}</p>
      ) : null}

      <button type="submit" disabled={isPending} className={buttonClass}>
        {isPending ? "..." : t("submit")}
      </button>
    </form>
  );
}
