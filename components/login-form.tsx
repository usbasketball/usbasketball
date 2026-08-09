"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { login, type ActionState } from "@/lib/actions/auth";
import {
  buttonClass,
  errorTextClass,
  inputClass,
  labelClass,
} from "@/lib/field-styles";

const initialState: ActionState = {};

export function LoginForm() {
  const t = useTranslations("Login");
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className={labelClass}>
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          {t("password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      {state?.error ? (
        <p className={errorTextClass}>{t(`errors.${state.error}`)}</p>
      ) : null}

      <button type="submit" disabled={isPending} className={buttonClass}>
        {isPending ? "..." : t("submit")}
      </button>
    </form>
  );
}
