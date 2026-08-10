import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Languages, MapPin, Sprout, BellRing } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your field | AgriGuard AI" },
      { name: "description", content: "Choose your language, mark your village and add your crop to get started." },
      { property: "og:title", content: "Set up your field | AgriGuard AI" },
      { property: "og:description", content: "Choose your language, mark your village and add your crop." },
    ],
  }),
  component: OnboardingPage,
});

const steps = [
  { icon: Languages, title: "Choose your language", description: "Telugu, Hindi or English — you can change it anytime." },
  { icon: MapPin, title: "Mark your village", description: "This gives you weather made for your own location." },
  { icon: Sprout, title: "Add your crop and field", description: "Crop, sowing date, soil and water source." },
  { icon: BellRing, title: "Turn on reminders", description: "Get told what to do, at the right time." },
];

function OnboardingPage() {
  return (
    <div className="bg-field min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <Logo />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Let us set up your field</h1>
          <p className="text-lg text-muted-foreground">
            Four short steps. After this, every suggestion you get is made for your own field.
          </p>
        </div>
        <ol className="space-y-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title}>
                <Card className="rounded-3xl shadow-soft">
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Step {i + 1}
                      </p>
                      <h2 className="text-lg font-semibold">{step.title}</h2>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ol>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="min-h-13 rounded-2xl px-8 text-base">
            <Link to="/dashboard">Go to my dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-13 rounded-2xl px-8 text-base">
            <Link to="/">Back to website</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}