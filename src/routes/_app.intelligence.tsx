import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { ComingSoon } from "@/components/common/ComingSoon";
import { Card, CardContent } from "@/components/ui/card";
import { secondaryNav } from "@/lib/navigation";

export const Route = createFileRoute("/_app/intelligence")({
  head: () => ({
    meta: [
      { title: "Field Intelligence | AgriGuard AI" },
      { name: "description", content: "Clear farming decisions with the reason behind them and the best action window." },
      { property: "og:title", content: "Field Intelligence | AgriGuard AI" },
      { property: "og:description", content: "Decisions, reasons and the right time to act on your field." },
    ],
  }),
  component: IntelligencePage,
});

function IntelligencePage() {
  return (
    <>
      <PageHeader
        emoji="🚨"
        title="Field Intelligence"
        description="Every suggestion comes with the reason behind it and the best time window to act."
      />
      <ComingSoon feature="Decisions and reasons" />
      <section className="grid gap-3 sm:grid-cols-3">
        {secondaryNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to}>
              <Card className="h-full rounded-3xl shadow-soft transition-transform hover:-translate-y-1">
                <CardContent className="space-y-2 p-5">
                  <Icon className="size-6 text-primary" aria-hidden />
                  <h2 className="text-base font-semibold">{item.label}</h2>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>
    </>
  );
}