import {ImageResponse} from "next/og";

export const runtime = "nodejs";
export const alt = "U.S. Basketball Amsterdam";
export const size = {width: 1200, height: 630};
export const contentType = "image/jpeg";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#111827",
      }}
    >
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.usbasketball.nl"}/kampioenschap-heren1-opt.webp`}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "56px 64px",
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-1px",
            lineHeight: 1.1,
            textTransform: "uppercase",
          }}
        >
          U.S. Basketball
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#d1d5db",
            marginTop: 8,
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          Amsterdam
        </div>
      </div>
    </div>,
    {width: 1200, height: 630},
  );
}
