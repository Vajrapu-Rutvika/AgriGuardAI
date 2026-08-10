import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { History } from "lucide-react";

export const Route = createFileRoute("/_app/history")({
  head: () => ({
    meta: [
      { title: "Field History | AgriGuard AI" },
      { name: "description", content: "A simple record of your crop checks, actions taken and recovery over time." },
      { property: "og:title", content: "Field History | AgriGuard AI" },
      { property: "og:description", content: "A record of your crop checks, actions and recovery." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <>
      <PageHeader
        emoji="📸"
        title="History"
        description="Your past checks, the actions you took and how your crop recovered."
      />
      <EmptyState
        icon={History}
        title="Nothing recorded yet."
        description="Your crop checks and the actions you take will be saved here so you can see recovery over time."
      />
    </>
  );
}