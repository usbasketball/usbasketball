import { getTranslations } from "next-intl/server";
import { MobileHeader } from "@/components/mobile-header";
import { LeftNav } from "@/components/left-nav";
import { auth0, authEnabled } from "@/lib/auth";

export async function Header() {
  const t = await getTranslations("Nav");

  const session = authEnabled() ? await auth0.getSession() : null;
  const isLoggedIn = Boolean(session);

  const items = [
    { href: "/about" as const, label: t("about") },
    { href: "/membership" as const, label: t("membership") },
    { href: "/schedule" as const, label: t("schedule") },
    { href: "/faq" as const, label: t("faq") },
  ];

  return (
    <>
      {/* Mobile & tablet: top bar with hamburger, hides on scroll down */}
      <MobileHeader items={items} isLoggedIn={isLoggedIn} />
      {/* Desktop: collapsed left nav */}
      <LeftNav isLoggedIn={isLoggedIn} />
    </>
  );
}
