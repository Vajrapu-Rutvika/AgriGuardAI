import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";

export const Route = createFileRoute("/_app/fields")({
  head: () => ({
    meta: [
      { title: "My Fields | AgriGuard AI" },
      { name: "description", content: "Add and manage your fields, crops, soil type and irrigation details." },
      { property: "og:title", content: "My Fields | AgriGuard AI" },
      { property: "og:description", content: "Add and manage your fields, crops and irrigation details." },
    ],
  }),
  component: FieldsPage,
});

function FieldsPage() {
  return (
    <>
      <PageHeader
        emoji="🌱"
        title="My Fields"
        description="Every guidance you receive is based on the fields you add here."
        actions={
          <Button size="lg" className="rounded-2xl" disabled>
            Add field
          </Button>
        }
      />
      <EmptyState
        icon={Sprout}
        title="No field added yet."
        description="Add your first field to start receiving personalized farming guidance."
      />
    </>
  );
}