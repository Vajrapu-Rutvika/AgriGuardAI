import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { primaryNav, secondaryNav } from "@/lib/navigation";
import { Sprout } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Farmer Home | AgriGuard AI" },
      { name: "description", content: "Your daily field summary, crop alerts and next farming actions in one place." },
      { property: "og:title", content: "Farmer Home | AgriGuard AI" },
      { property: "og:description", content: "Your daily field summary, crop alerts and next farming actions." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const shortcuts = [...primaryNav.slice(1, 5), ...secondaryNav];

  return (
    <>
      <PageHeader
        emoji="🌾"
        title="Namaste, farmer"
        description="Add your field to start getting guidance made for your crop, your soil and your weather."
        actions={
          <Button asChild size="lg" className="rounded-2xl">
            <Link to="/fields">Add my field</Link>
          </Button>
        }
      />

      <EmptyState
        icon={Sprout}
        title="No field added yet."
        description="Add your first field to start receiving personalized farming guidance."
        action={
          <Button asChild size="lg" className="rounded-2xl">
            <Link to="/fields">Add my first field</Link>
          </Button>
        }
      />

      <section aria-labelledby="shortcuts" className="space-y-3">
        <h2 id="shortcuts" className="text-xl font-semibold">
          Quick actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to}>
                <Card className="h-full rounded-3xl shadow-soft transition-transform hover:-translate-y-1">
                  <CardContent className="flex items-start gap-3 p-5">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-base font-semibold">{item.label}</span>
                      <span className="block text-muted-foreground">{item.description}</span>
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}