import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {Inter} from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import {isValidLocale, getDictionary} from "@/lib/i18n";
import type {Locale} from "@/lib/i18n";
import "../globals.css";

const inter = Inter({variable: "--font-inter", subsets: ["latin"]});

export async function generateStaticParams() {
  return [{locale: "nl"}, {locale: "en"}];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const isNl = locale === "nl";
  return {
    title: {
      default: "U.S. Basketball Amsterdam",
      template: "%s | U.S. Basketball Amsterdam",
    },
    description: isNl
      ? "U.S. Basketball Amsterdam — basketbalclub met dames- en herenteams voor spelers 18+. Thuis in de Amstelcampushal."
      : "U.S. Basketball Amsterdam — basketball club with women's and men's teams for players 18+. Based at the Amstelcampushal.",
    openGraph: {
      type: "website",
      siteName: "U.S. Basketball Amsterdam",
      locale: isNl ? "nl_NL" : "en_US",
      alternateLocale: isNl ? "en_US" : "nl_NL",
      images: [
        {
          url: "/icon.png",
          width: 192,
          height: 192,
          alt: "U.S. Basketball Amsterdam logo",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: "U.S. Basketball Amsterdam",
      description: isNl
        ? "U.S. Basketball Amsterdam — basketbalclub met dames- en herenteams voor spelers 18+. Thuis in de Amstelcampushal."
        : "U.S. Basketball Amsterdam — basketball club with women's and men's teams for players 18+. Based at the Amstelcampushal.",
      images: ["/icon.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} antialiased flex flex-col min-h-screen`}
      >
        <JsonLd locale={locale} />
        <Header locale={locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
