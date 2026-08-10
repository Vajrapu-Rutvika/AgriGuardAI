import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/_app/risk")({
  head: () => ({
    meta: [
      { title: "Risk Prediction | AgriGuard AI" },
      { name: "description", content: "See early warnings for pest, disease and weather risk on your crop." },
      { property: "og:title", content: "Risk Prediction | AgriGuard AI" },
      { property: "og:description", content: "Early warnings for pest, disease and weather risk." },
    ],
  }),
  component: RiskPage,
});

function RiskPage() {
  return (
    <>
      <PageHeader
        emoji="🔮"
        title="Risk Prediction"
        description="Early warning for pest, disease and weather trouble, before the damage is visible."
      />
      <ComingSoon feature="Risk prediction" />
    </>
  );
}