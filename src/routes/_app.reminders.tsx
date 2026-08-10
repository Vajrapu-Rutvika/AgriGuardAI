import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { BellRing } from "lucide-react";

export const Route = createFileRoute("/_app/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders | AgriGuard AI" },
      { name: "description", content: "Timely reminders for spraying, irrigation and field checks." },
      { property: "og:title", content: "Reminders | AgriGuard AI" },
      { property: "og:description", content: "Timely reminders for spraying, irrigation and field checks." },
    ],
  }),
  component: RemindersPage,
});

function RemindersPage() {
  return (
    <>
      <PageHeader
        emoji="🔔"
        title="Reminders"
        description="Gentle reminders that change with the weather and the stage of your crop."
      />
      <EmptyState
        icon={BellRing}
        title="No reminders yet."
        description="Once you add a field, reminders for watering, spraying and checking your crop will appear here."
      />
    </>
  );
}