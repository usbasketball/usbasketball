import { getTranslations } from "next-intl/server";
import { MobileHeader } from "@/components/mobile-header";
import { LeftNav } from "@/components/left-nav";

export async function Header() {
  const t = await getTranslations("Nav");

  const items = [
    { href: "/about" as const, label: t("about") },
    { href: "/membership" as const, label: t("membership") },
    { href: "/schedule" as const, label: t("schedule") },
  ];

  return (
    <>
      {/* Mobile & tablet: top bar with hamburger, hides on scroll down */}
      <MobileHeader items={items} />
      {/* Desktop: collapsed left nav */}
      <LeftNav />
    </>
  );
}
