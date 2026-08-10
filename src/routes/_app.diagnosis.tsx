import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ComingSoon } from "@/components/common/ComingSoon";
import { Camera } from "lucide-react";

export const Route = createFileRoute("/_app/diagnosis")({
  head: () => ({
    meta: [
      { title: "Crop Diagnosis | AgriGuard AI" },
      { name: "description", content: "Take a photo of your crop leaf and get a clear explanation of what may be wrong." },
      { property: "og:title", content: "Crop Diagnosis | AgriGuard AI" },
      { property: "og:description", content: "Photo-based crop check with plain-language guidance." },
    ],
  }),
  component: DiagnosisPage,
});

function DiagnosisPage() {
  return (
    <>
      <PageHeader
        emoji="📷"
        title="Crop Diagnosis"
        description="Take a clear photo of the affected leaf, stem or fruit. You will get an answer in simple words."
      />
      <EmptyState
        icon={Camera}
        title="No crop photo checked yet."
        description="Photo checking will open once your field is added and the diagnosis service is connected."
      />
      <ComingSoon feature="Photo diagnosis" />
    </>
  );
}