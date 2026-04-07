import Link from "next/link";
import {Inter} from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {defaultLocale, getDictionary} from "@/lib/i18n";
import "./globals.css";

const inter = Inter({variable: "--font-inter", subsets: ["latin"]});

const locale = defaultLocale;
const dict = getDictionary(locale);

export default function NotFound() {
  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header locale={locale} dict={dict} />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
          <p className="text-gray-900 font-black text-6xl sm:text-8xl leading-none mb-4">
            404
          </p>
          <h1 className="text-gray-900 font-black text-2xl sm:text-3xl uppercase tracking-tight mb-3">
            Page not found
          </h1>
          <p className="text-gray-500 text-sm max-w-sm mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-11 px-6 bg-gray-900 text-white font-bold text-sm uppercase tracking-wide hover:bg-gray-700 transition-all"
          >
            Back to home
          </Link>
        </main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
