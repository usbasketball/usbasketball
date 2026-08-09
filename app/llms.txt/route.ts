import { siteConfig } from "@/lib/site";

export function GET() {
  const body = [
    `# ${siteConfig.name}`,
    "",
    "> Amateur basketball club in Utrecht, Netherlands. Fun, teamwork and improvement.",
    "",
    "## Contact",
    `- Email: ${siteConfig.email}`,
    `- Location: ${siteConfig.address}`,
    "",
    "## Key facts",
    `- Founded: ${siteConfig.foundedYear}`,
    "- Sport: Basketball",
    "- League: NBB (Nederlandse Basketball Bond)",
    "- Teams: Under-10 to seniors, men and women",
    "",
    "## Membership",
    "- Open to all ages and levels, from beginners to experienced players.",
    "- You can join two training sessions for free before you decide to become a member.",
    "- Youth (under 18): 120 EUR per season. Adults: 180 EUR per season. Family discount of 15% from the second family member.",
    "- Sign up via the online form on the website; your membership starts immediately.",
    "- Deregistration is possible at the end of the season with a one-month notice period.",
    "",
    "## Pages",
    `- Home: ${siteConfig.url}/en and ${siteConfig.url}/nl`,
    `- About: ${siteConfig.url}/en/about and ${siteConfig.url}/nl/about`,
    `- Teams: ${siteConfig.url}/en/teams and ${siteConfig.url}/nl/teams`,
    `- Membership: ${siteConfig.url}/en/membership and ${siteConfig.url}/nl/membership`,
    `- Privacy policy: ${siteConfig.url}/en/privacy and ${siteConfig.url}/nl/privacy`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
