import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import PlaceholderContent from "@/components/ui/PlaceholderContent";

export const metadata: Metadata = {
  title: "Help US",
  description: "Steun U.S. Basketball Amsterdam — als sponsor, vrijwilliger of fan.",
};

export default function HelpUs() {
  return (
    <>
      <PageHeader
        title="Help US"
        subtitle="Steun de club als sponsor, vrijwilliger of via onze partnerwinkels."
      />
      <PlaceholderContent description="Hier vind je informatie over hoe je de club kunt ondersteunen — sponsoring, donaties en fundraising via partnerwinkels." />
    </>
  );
}
