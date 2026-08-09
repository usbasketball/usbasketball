"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { signup, type ActionState } from "@/lib/actions/auth";
import {
  buttonClass,
  errorTextClass,
  inputClass,
  labelClass,
} from "@/lib/field-styles";

const initialState: ActionState = {};

export function SignupForm() {
  const t = useTranslations("Signup");
  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            {t("firstName")} *
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            {t("lastName")} *
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          {t("email")} *
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            {t("phone")}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="team" className={labelClass}>
            {t("team")}
          </label>
          <input id="team" name="team" type="text" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          {t("password")} *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-zinc-500">{t("passwordHelp")}</p>
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
