import { siteConfig } from "@/lib/site";

export function GET() {
  const body = [
    `# ${siteConfig.name}`,
    "",
    "> The most gezellig basketball club in Amsterdam, Netherlands, since 1951. If you can't beat us, join US!",
    "",
    "## Contact",
    `- Email: ${siteConfig.email}`,
    `- Location: ${siteConfig.address}`,
    "",
    "## Key facts",
    `- Founded: ${siteConfig.foundedYear}`,
    "- Sport: Basketball",
    "- League: NBB (Nederlandse Basketball Bond)",
    "- Seniors only (18+); no youth basketball",
    "- 12 teams: six women's and six men's teams",
    "- Competition teams train on Wednesday evenings (75 minutes); some teams also train on Friday",
    "- Home games are played on Sundays at the Amstelcampushal",
    "- A recreational team trains on Tuesday and Thursday evenings at the Apollohal",
    "",
    "## Membership",
    "- Open to adults (18+) of all levels, from beginners to experienced players.",
    "- You can join two training sessions for free before you decide to become a member.",
    "- Fill in the interest form on the website; the committee will invite you to a trial training and match you to a suitable team.",
    "- Membership fees per season:",
    "  - Competition player: EUR 330 (trains 2x per week), EUR 300 (1.5x per week), EUR 270 (1x per week)",
    "  - Recreational member: EUR 170",
    "  - Students get 10% discount on their membership fee.",
    "- Joining between 1 August and 31 December: full season fee. Joining between 1 January and 31 March: reduced season fee.",
    "- To cancel your membership, email secretaris@usbasketball.nl; this is the only official way to cancel. Cancellation for the new season must be done before 1 May; cancelling after 1 May costs a one-off fee of EUR 50. No membership fees are refunded for mid-season cancellation after the season starts (1 September).",
    "",
    "## Pages",
    `- Home: ${siteConfig.url}/en and ${siteConfig.url}/nl`,
    `- About: ${siteConfig.url}/en/about and ${siteConfig.url}/nl/about`,
    `- Membership: ${siteConfig.url}/en/membership and ${siteConfig.url}/nl/membership`,
    `- Sign up (interest form): ${siteConfig.url}/en/signup and ${siteConfig.url}/nl/signup`,
    `- Privacy policy: ${siteConfig.url}/en/privacy and ${siteConfig.url}/nl/privacy`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
