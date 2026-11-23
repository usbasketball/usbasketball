"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Click-to-load video. The third-party iframe (and so the visitor's IP address
 * reaching YouTube/Vimeo) only happens after an explicit click.
 */
export function VideoEmbed({
  src,
  title,
  provider,
}: {
  src: string;
  title: string;
  provider: string;
}) {
  const t = useTranslations("VideoEmbed");
  const [loaded, setLoaded] = useState(false);

  const playSrc = () => {
    const url = new URL(src);
    url.searchParams.set("autoplay", "1");
    return url.toString();
  };

  return (
    <div className="aspect-video overflow-hidden border border-line bg-black">
      {loaded ? (
        <iframe
          src={playSrc()}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center text-white">
          <p className="max-w-md text-sm text-white/80">
            {t("notice", { provider })}
          </p>
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="border border-white px-4 py-2 text-sm font-medium transition hover:bg-white/10"
          >
            {t("load", { title })}
          </button>
        </div>
      )}
    </div>
  );
}
