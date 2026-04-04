import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import PlaceholderContent from "@/components/ui/PlaceholderContent";

export const metadata: Metadata = {
  title: "Takenschema",
  description: "Vrijwilligerstaken en schema voor U.S. Basketball leden.",
};

export default function Takenschema() {
  return (
    <>
      <PageHeader
        title="Takenschema"
        subtitle="Het overzicht van vrijwilligerstaken voor dit seizoen."
      />
      <PlaceholderContent description="Hier staat het takenschema — wie welke taak heeft bij thuiswedstrijden en andere activiteiten." />
    </>
  );
}
