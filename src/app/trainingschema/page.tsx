import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import PlaceholderContent from "@/components/ui/PlaceholderContent";

export const metadata: Metadata = {
  title: "Trainingschema",
  description: "Trainingstijden en -locaties voor alle U.S. Basketball teams.",
};

export default function Trainingschema() {
  return (
    <>
      <PageHeader
        title="Trainingschema"
        subtitle="Trainingstijden en locaties voor alle dames- en herenteams."
      />
      <PlaceholderContent description="Hier komen de trainingstijden per team voor het seizoen 2024-2025." />
    </>
  );
}
