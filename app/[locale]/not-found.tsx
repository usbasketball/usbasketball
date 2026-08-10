import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

function Basketball({ className }: { className?: string }) {
  return (
    <span className={`inline-block animate-bounce ${className ?? ""}`}>
      <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#e8792b" />
        <path
          d="M12 2v20"
          stroke="#1a1a1a"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M2 12h20"
          stroke="#1a1a1a"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M5.6 4.9c4.3 1.4 8.5 1.4 12.8 0M5.6 19.1c4.3-1.4 8.5-1.4 12.8 0"
          stroke="#1a1a1a"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound");

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p
        role="img"
        aria-label="404"
        className="flex items-center font-display text-8xl leading-none tracking-wide sm:text-9xl"
      >
        <span aria-hidden="true" className="text-accent">
          4
        </span>
        <span aria-hidden="true" className="mx-2 h-[0.9em] w-[0.9em]">
          <Basketball />
        </span>
        <span aria-hidden="true" className="text-accent">
          4
        </span>
      </p>
      <div aria-hidden="true" className="mt-6 h-0.5 w-40 rounded bg-line" />
      <h1 className="mt-8 font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-ink-muted">{t("description")}</p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center justify-center bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-brand-darker"
      >
        {t("home")}
      </Link>
    </div>
  );
}
