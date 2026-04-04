import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "U.S. Basketball Amsterdam",
    template: "%s | U.S. Basketball Amsterdam",
  },
  description:
    "U.S. Basketball Amsterdam — basketbalclub met dames- en herenteams voor spelers 18+. Thuis in de Amstelcampushal.",
  openGraph: {
    siteName: "U.S. Basketball Amsterdam",
    locale: "nl_NL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${inter.variable} antialiased flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
