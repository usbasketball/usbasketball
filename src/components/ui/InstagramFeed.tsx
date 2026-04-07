"use client";

import Script from "next/script";
import Image from "next/image";
import {useState} from "react";

const POST_URL =
  "https://www.instagram.com/p/DIZDlQiok7_/?utm_source=ig_embed&utm_campaign=loading"; // H4 champion

export default function InstagramFeed() {
  const [scriptFailed, setScriptFailed] = useState(false);

  if (scriptFailed) {
    return (
      <a
        href={POST_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{display: "block", maxWidth: "540px", margin: "0 auto"}}
      >
        <Image
          src="/instagram-post.webp"
          alt="U.S. Basketball Amsterdam H4 kampioen — bekijk op Instagram"
          width={540}
          height={540}
          style={{width: "100%", height: "auto", borderRadius: "3px"}}
        />
      </a>
    );
  }

  return (
    <>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="afterInteractive"
        onError={() => setScriptFailed(true)}
      />
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={POST_URL}
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
    </>
  );
}
