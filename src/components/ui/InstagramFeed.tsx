"use client";

import {useEffect} from "react";

const INSTGRAM_POST_URL =
  "https://www.instagram.com/p/DIZDlQiok7_/?utm_source=ig_embed&utm_campaign=loading"; // H4 champion

export default function InstagramFeed() {
  useEffect(() => {
    if (
      (window as unknown as {instgrm?: {Embeds: {process: () => void}}}).instgrm
    ) {
      (
        window as unknown as {instgrm: {Embeds: {process: () => void}}}
      ).instgrm.Embeds.process();
    } else {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={INSTGRAM_POST_URL}
      data-instgrm-version="14"
      style={{
        background: "#FFF",
        border: 0,
        borderRadius: "3px",
        boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
        margin: "0 auto",
        maxWidth: "540px",
        minWidth: "326px",
        padding: 0,
        width: "calc(100% - 2px)",
      }}
    />
  );
}
