import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FeatureCard } from "@/components/common/FeatureCard";
import { Button } from "@/components/ui/button";
import heroFarm from "@/assets/hero-farm.jpg";
import farmer from "@/assets/farmer-illustration.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriGuard AI — Your Farming Companion" },
      {
        name: "description",
        content:
          "AgriGuard AI turns field signals, weather and crop photos into clear farming decisions, in Telugu, Hindi and English.",
      },
      { property: "og:title", content: "AgriGuard AI — Your Farming Companion" },
      {
        property: "og:description",
        content: "From field signals to the right farming decision. Voice-enabled guidance for every farmer.",
      },
    ],
  }),
  component: LandingPage,
});

const features = [
  { emoji: "📷", title: "AI Crop Diagnosis", description: "Show a photo of the leaf and learn what is troubling your crop." },
  { emoji: "🌦️", title: "Weather Intelligence", description: "Rain, heat and wind for your village, explained for farm work." },
  { emoji: "🚨", title: "Decision + WHY", description: "Every suggestion comes with the plain reason behind it." },
  { emoji: "⏰", title: "Smart Action Window", description: "Know the best hours to spray, water or harvest." },
  { emoji: "🔮", title: "Risk Prediction", description: "Early warning for pest, disease and weather trouble." },
  { emoji: "🧪", title: "What-If", description: "Compare choices before spending money on inputs." },
  { emoji: "🎙️", title: "Talk to My Field", description: "Ask by voice in Telugu, Hindi or English." },
  { emoji: "🔔", title: "Adaptive Reminders", description: "Reminders that change with weather and crop stage." },
  { emoji: "📸", title: "Crop Recovery", description: "Track how your crop recovers after each action." },
];

const steps = ["OBSERVE", "UNDERSTAND", "PREDICT", "EXPLAIN", "DECIDE", "ACT", "TRACK", "LEARN"];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <img
            src={heroFarm}
            alt="Green paddy fields at sunrise beside a village pathway and irrigation canal"
            width={1920}
            height={1088}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="relative bg-background/75 backdrop-blur-[2px]">
            <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center md:px-6 md:py-24">
              <div className="space-y-6">
                <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-secondary-foreground">
                  🌱 AgriGuard AI
                </p>
                <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                  From Field Signals to the Right Farming Decision.
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
                  An intelligent farming companion that understands your field, weather and crop conditions.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="min-h-14 rounded-2xl px-8 text-lg">
                    <Link to="/signup">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="min-h-14 rounded-2xl px-8 text-lg">
                    <Link to="/chat">🎙️ Talk to My Field</Link>
                  </Button>
                </div>
                <p className="text-muted-foreground">Works in తెలుగు, हिंदी and English.</p>
              </div>
              <img
                src={farmer}
                alt="Illustration of a farmer using AgriGuard AI on a phone"
                width={1024}
                height={1024}
                loading="lazy"
                className="mx-auto w-56 drop-shadow-xl sm:w-72 md:w-full md:max-w-sm"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-field py-16 md:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl font-bold sm:text-4xl">What AgriGuard AI does for you</h2>
              <p className="text-lg text-muted-foreground">
                Simple help for everyday farming questions — no complicated words, no guesswork.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16 md:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>
              <p className="text-lg text-muted-foreground">
                AgriGuard AI follows the same rhythm a good farmer follows every season.
              </p>
            </div>
            <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <li
                  key={step}
                  className="flex items-center gap-3 rounded-3xl border border-border bg-card px-5 py-4 shadow-soft"
                >
                  <span className="bg-leaf-gradient flex size-10 shrink-0 items-center justify-center rounded-full font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="font-display text-lg font-semibold tracking-wide">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-sunrise py-16">
          <div className="mx-auto w-full max-w-3xl space-y-5 px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold sm:text-4xl">Start with one field</h2>
            <p className="text-lg text-muted-foreground">
              Add your field, and AgriGuard AI will guide you through the season, one decision at a time.
            </p>
            <Button asChild size="lg" className="min-h-14 rounded-2xl px-8 text-lg">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
