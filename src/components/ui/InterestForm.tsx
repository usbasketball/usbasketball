"use client";

import {useState} from "react";
import Script from "next/script";
import Button from "@/components/ui/Button";
import type {Dictionary} from "@/lib/i18n";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

type AanmeldenDict = Dictionary["aanmelden"];

interface Props {
  t: AanmeldenDict;
  locale: string;
}

interface FormData {
  name: string;
  birthDate: string;
  email: string;
  gender: string;
  lastLevel: string;
  lastSeason: string;
  position: string;
  interest: string;
  remarks: string;
}

const EMPTY: FormData = {
  name: "",
  birthDate: "",
  email: "",
  gender: "",
  lastLevel: "",
  lastSeason: "",
  position: "",
  interest: "",
  remarks: "",
};

const inputClass =
  "w-full h-11 px-3 bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors";
const labelClass = "text-gray-500 text-xs font-bold uppercase tracking-wide";
const errorClass = "text-red-500 text-xs mt-1";

export default function InterestForm({t, locale}: Props) {
  const [data, setData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  function set(field: keyof FormData, value: string) {
    setData((prev) => ({...prev, [field]: value}));
    if (errors[field]) setErrors((prev) => ({...prev, [field]: ""}));
  }

  function validate(): boolean {
    const newErrors: Partial<FormData> = {};
    (Object.keys(EMPTY) as (keyof FormData)[]).forEach((field) => {
      if (!data[field].trim()) newErrors[field] = t.required;
    });
    if (!newErrors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = t.invalidEmail;
    }
    if (!newErrors.birthDate && data.birthDate) {
      const dob = new Date(data.birthDate);
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 18);
      if (dob > cutoff) newErrors.birthDate = t.underage;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const recaptchaToken: string = await new Promise((resolve, reject) => {
        const gr = (
          window as unknown as {
            grecaptcha?: {
              execute: (key: string, opts: {action: string}) => Promise<string>;
            };
          }
        ).grecaptcha;
        if (!gr) return reject(new Error("reCAPTCHA not loaded"));
        gr.execute(SITE_KEY, {action: "register"}).then(resolve).catch(reject);
      });
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({...data, locale, recaptchaToken}),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-12 h-12 bg-gray-900 flex items-center justify-center mx-auto mb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-gray-900 font-black text-xl uppercase mb-2">
          {t.successTitle}
        </h2>
        <p className="text-gray-600 text-sm">{t.successText}</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
        strategy="lazyOnload"
      />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white border border-gray-100 shadow-sm p-8 flex flex-col gap-5"
      >
        {/* Name */}
        <div>
          <label className={labelClass}>{t.name}</label>
          <input
            type="text"
            className={inputClass}
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
            autoComplete="name"
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>

        {/* Date of birth */}
        <div>
          <label className={labelClass}>{t.birthDate}</label>
          <input
            type="date"
            className={inputClass}
            value={data.birthDate}
            onChange={(e) => set("birthDate", e.target.value)}
          />
          {errors.birthDate && <p className={errorClass}>{errors.birthDate}</p>}
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>{t.emailField}</label>
          <input
            type="email"
            className={inputClass}
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className={labelClass}>{t.gender}</label>
          <div className="flex gap-4 mt-2">
            {[
              {value: t.genderMale, label: t.genderMale},
              {value: t.genderFemale, label: t.genderFemale},
            ].map(({value, label}) => (
              <label
                key={value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="gender"
                  value={value}
                  checked={data.gender === value}
                  onChange={(e) => set("gender", e.target.value)}
                  className="accent-gray-900"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className={errorClass}>{errors.gender}</p>}
        </div>

        {/* Last level played */}
        <div>
          <label className={labelClass}>{t.lastLevel}</label>
          <input
            type="text"
            className={inputClass}
            placeholder={t.lastLevelPlaceholder}
            value={data.lastLevel}
            onChange={(e) => set("lastLevel", e.target.value)}
          />
          {errors.lastLevel && <p className={errorClass}>{errors.lastLevel}</p>}
        </div>

        {/* Last season played */}
        <div>
          <label className={labelClass}>{t.lastSeason}</label>
          <input
            type="text"
            className={inputClass}
            placeholder={t.lastSeasonPlaceholder}
            value={data.lastSeason}
            onChange={(e) => set("lastSeason", e.target.value)}
          />
          {errors.lastSeason && (
            <p className={errorClass}>{errors.lastSeason}</p>
          )}
        </div>

        {/* Position */}
        <div>
          <label className={labelClass}>{t.position}</label>
          <select
            className={inputClass}
            value={data.position}
            onChange={(e) => set("position", e.target.value)}
          >
            <option value="" disabled />
            <option value={t.positionGuard}>{t.positionGuard}</option>
            <option value={t.positionForward}>{t.positionForward}</option>
            <option value={t.positionCenter}>{t.positionCenter}</option>
            <option value={t.positionNvt}>{t.positionNvt}</option>
            <option value={t.positionOther}>{t.positionOther}</option>
          </select>
          {errors.position && <p className={errorClass}>{errors.position}</p>}
        </div>

        {/* Interest */}
        <div>
          <label className={labelClass}>{t.interest}</label>
          <select
            className={inputClass}
            value={data.interest}
            onChange={(e) => set("interest", e.target.value)}
          >
            <option value="" disabled />
            <option value={t.interestBoth}>{t.interestBoth}</option>
            <option value={t.interestTrainingOnly}>
              {t.interestTrainingOnly}
            </option>
            <option value={t.interestNotSure}>{t.interestNotSure}</option>
          </select>
          {errors.interest && <p className={errorClass}>{errors.interest}</p>}
        </div>

        {/* Remarks */}
        <div>
          <label className={labelClass}>{t.remarks}</label>
          <textarea
            className="w-full px-3 py-2 bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors resize-none"
            rows={4}
            placeholder={t.remarksPlaceholder}
            value={data.remarks}
            onChange={(e) => set("remarks", e.target.value)}
          />
        </div>

        {status === "error" && (
          <p className="text-red-500 text-sm">{t.errorText}</p>
        )}

        <Button type="submit" disabled={status === "loading"} className="mt-2">
          {status === "loading" ? t.submitting : t.submit}
        </Button>
      </form>
    </>
  );
}
