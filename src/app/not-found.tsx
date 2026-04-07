import Button from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {Inter} from "next/font/google";
import {Auth0Provider} from "@auth0/nextjs-auth0";
import {defaultLocale, getDictionary} from "@/lib/i18n";
import "./globals.css";

const inter = Inter({variable: "--font-inter", subsets: ["latin"]});

const locale = defaultLocale;
const dict = getDictionary(locale);

export default function NotFound() {
  return (
    <Auth0Provider>
      <html lang={locale}>
        <body
          className={`${inter.variable} antialiased flex flex-col min-h-screen`}
        >
          <Header locale={locale} dict={dict} />
          <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
            {/* Basketball icon */}
            <div className="relative mb-8 select-none">
              <span
                className="text-8xl sm:text-9xl"
                role="img"
                aria-label="basketball"
              >
                🏀
              </span>
              <span className="absolute -top-2 -right-4 bg-gray-900 text-white text-xs font-black px-2 py-0.5 uppercase tracking-wide rotate-12">
                Air ball
              </span>
            </div>

            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
              Error 404
            </p>
            <h1 className="text-gray-900 font-black text-3xl sm:text-4xl uppercase tracking-tight mb-3">
              Shot missed.
            </h1>
            <p className="text-gray-500 text-sm max-w-xs mb-8">
              This page doesn&apos;t exist — even Steph Curry misses sometimes.
              Let&apos;s get you back on the court.
            </p>

            <Button href="/" size="md">
              Back to home
            </Button>
          </main>
          <Footer locale={locale} dict={dict} />
        </body>
      </html>
    </Auth0Provider>
  );
}
