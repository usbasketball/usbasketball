import type {Metadata} from "next";

export const metadata: Metadata = {
  title: {
    default: "U.S. Basketball Amsterdam",
    template: "%s | U.S. Basketball Amsterdam",
  },
  description:
    "U.S. Basketball Amsterdam — basketball club with women's and men's teams for players 18+.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
    shortcut: "/shortcut-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
