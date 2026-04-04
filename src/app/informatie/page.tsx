import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import PlaceholderContent from "@/components/ui/PlaceholderContent";

export const metadata: Metadata = {
  title: "Informatie",
  description: "Alles over U.S. Basketball Amsterdam — club info, teams en meer.",
};

export default function Informatie() {
  return (
    <>
      <PageHeader
        title="Informatie"
        subtitle="Alles over U.S. Basketball Amsterdam — van clubgeschiedenis tot teamindelingen."
      />
      <PlaceholderContent description="Hier komt informatie over de club, de teams, het bestuur en de faciliteiten." />
    </>
  );
}
