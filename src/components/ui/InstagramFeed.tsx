"use client";

import Script from "next/script";
import Image from "next/image";
import {useState} from "react";

const POST_URL =
  "https://www.instagram.com/p/DIZDlQiok7_/?utm_source=ig_embed&utm_campaign=loading"; // H4 champion

const PROFILE_URL = "https://www.instagram.com/usbasketbal/";

function InstagramFallback() {
  return (
    <div
      style={{
        background: "#fff",
        border: 0,
        borderRadius: "3px",
        boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
        margin: "0 auto",
        maxWidth: "540px",
        minWidth: "326px",
        width: "calc(100% - 2px)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{display: "flex", alignItems: "center", padding: "14px 16px", gap: "10px"}}>
        <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer" style={{flexShrink: 0}}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
            padding: 2, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{width: "100%", height: "100%", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"}}>
              <Image
                src="/us_logo_png.avif"
                alt="usbasketbal"
                width={28}
                height={28}
                style={{borderRadius: "50%", objectFit: "cover"}}
              />
            </div>
          </div>
        </a>
        <div style={{flex: 1, minWidth: 0}}>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{display: "block", fontWeight: 600, fontSize: "14px", color: "#262626", textDecoration: "none", lineHeight: 1.4}}
          >
            usbasketbal
          </a>
          <span style={{fontSize: "12px", color: "#8e8e8e", lineHeight: 1.4}}>U.S. Basketball Amsterdam</span>
        </div>
        {/* Instagram logo */}
        <a href={POST_URL} target="_blank" rel="noopener noreferrer" aria-label="View on Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="#262626" stroke="none"/>
          </svg>
        </a>
      </div>

      {/* Image */}
      <a href={POST_URL} target="_blank" rel="noopener noreferrer" style={{display: "block"}}>
        <Image
          src="/instagram-post.webp"
          alt="U.S. Basketball Amsterdam H4 kampioen"
          width={1079}
          height={742}
          style={{width: "100%", height: "auto", display: "block"}}
        />
      </a>

      {/* Caption */}
      <div style={{padding: "12px 16px 4px"}}>
        <span style={{fontSize: "14px", color: "#262626", lineHeight: "18px"}}>
          <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer" style={{fontWeight: 600, color: "#262626", textDecoration: "none", marginRight: 4}}>usbasketbal</a>
          Now officially champs: H4! 🏆🥇🍾
        </span>
      </div>

      {/* Footer */}
      <div style={{padding: "8px 16px 14px"}}>
        <a
          href={POST_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{fontSize: "12px", color: "#8e8e8e", textDecoration: "none"}}
        >
          View this post on Instagram
        </a>
      </div>
    </div>
  );
}

export default function InstagramFeed() {
  const [scriptFailed, setScriptFailed] = useState(false);

  return (
    <>
      {!scriptFailed && (
        <Script
          src="https://www.instagram.com/embed.js"
          strategy="afterInteractive"
          onError={() => setScriptFailed(true)}
        />
      )}
      {scriptFailed ? (
        <InstagramFallback />
      ) : (
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
      )}
    </>
  );
}
