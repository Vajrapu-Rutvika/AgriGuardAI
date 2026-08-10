import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/_app/what-if")({
  head: () => ({
    meta: [
      { title: "What-If Planner | AgriGuard AI" },
      { name: "description", content: "Compare farming choices such as spraying today or waiting two days." },
      { property: "og:title", content: "What-If Planner | AgriGuard AI" },
      { property: "og:description", content: "Compare farming choices before you spend money." },
    ],
  }),
  component: WhatIfPage,
});

function WhatIfPage() {
  return (
    <>
      <PageHeader
        emoji="🧪"
        title="What-If"
        description="Ask questions like: what happens if I spray today, or if I wait two more days?"
      />
      <ComingSoon feature="What-if comparison" />
    </>
  );
}