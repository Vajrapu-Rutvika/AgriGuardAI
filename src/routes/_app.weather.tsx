import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/_app/weather")({
  head: () => ({
    meta: [
      { title: "Weather Intelligence | AgriGuard AI" },
      { name: "description", content: "Rain, heat and wind for your village, explained for farming decisions." },
      { property: "og:title", content: "Weather Intelligence | AgriGuard AI" },
      { property: "og:description", content: "Farm weather explained for spraying, irrigation and harvest." },
    ],
  }),
  component: WeatherPage,
});

function WeatherPage() {
  return (
    <>
      <PageHeader
        emoji="🌦️"
        title="Weather Intelligence"
        description="Rain, heat, humidity and wind for your village, explained in terms of what you should do in the field."
      />
      <ComingSoon
        feature="Village weather"
        note="Live weather for your field location will appear here once your field and its location are added."
      />
    </>
  );
}