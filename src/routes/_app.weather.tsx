import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CloudSun, MapPinOff, RefreshCcw, Sprout } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActiveField } from "@/hooks/useActiveField";
import { getFieldWeather } from "@/lib/weather.functions";
import type { FarmAdvisory } from "@/lib/weather-types";

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
  const { activeField, isLoading: fieldsLoading } = useActiveField();
  const fetchWeather = useServerFn(getFieldWeather);
  const hasLocation =
    typeof activeField?.latitude === "number" && typeof activeField?.longitude === "number";

  const weather = useQuery({
    queryKey: ["weather", activeField?.id, activeField?.latitude, activeField?.longitude],
    queryFn: () =>
      fetchWeather({ data: { latitude: activeField!.latitude!, longitude: activeField!.longitude! } }),
    enabled: Boolean(activeField && hasLocation),
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return (
    <>
      <PageHeader
        emoji="🌦️"
        title="Weather Intelligence"
        description="Rain, heat, humidity and wind for your village, explained in terms of what you should do in the field."
        actions={
          activeField && hasLocation ? (
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl"
              disabled={weather.isFetching}
              onClick={() => void weather.refetch()}
            >
              <RefreshCcw className="size-5" aria-hidden /> Refresh
            </Button>
          ) : null
        }
      />

      {!fieldsLoading && !activeField ? (
        <EmptyState
          icon={Sprout}
          title="No field added yet."
          description="Add your first field with its location so we can show weather for that exact place."
          action={
            <Button asChild size="lg" className="rounded-2xl">
              <Link to="/fields">Add my field</Link>
            </Button>
          }
        />
      ) : null}

      {activeField && !hasLocation ? (
        <EmptyState
          icon={MapPinOff}
          title="Your field has no location yet."
          description="Open your field and set its location, or use the GPS button, so weather can be matched to your farm."
          action={
            <Button asChild size="lg" className="rounded-2xl">
              <Link to="/fields">Update field location</Link>
            </Button>
          }
        />
      ) : null}

      {activeField && hasLocation ? (
        <p className="rounded-2xl bg-sky/25 px-4 py-3">
          🌾 Weather for <strong>{activeField.name}</strong>
          {activeField.village ? ` · ${activeField.village}` : ""}
          {activeField.crop ? ` · ${activeField.crop}` : ""}
        </p>
      ) : null}

      {weather.isPending && activeField && hasLocation ? (
        <LoadingState message="🌱 Checking the sky above your field..." />
      ) : null}

      {weather.isError ? (
        <WeatherProblem
          message="We could not reach the weather service. Please check your connection and try again."
          onRetry={() => void weather.refetch()}
        />
      ) : null}

      {weather.data && !weather.data.ok ? (
        <WeatherProblem message={weather.data.error} onRetry={() => void weather.refetch()} />
      ) : null}

      {weather.data?.ok ? (
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-3xl border-sky/40 shadow-soft">
            <CardContent className="grid gap-6 bg-sky/20 p-6 sm:grid-cols-2">
              <div>
                <p className="text-6xl" aria-hidden>
                  {weather.data.data.current.emoji}
                </p>
                <p className="mt-2 text-4xl font-bold">{weather.data.data.current.temperature}°C</p>
                <p className="text-lg">{weather.data.data.current.condition}</p>
              </div>
              <dl className="grid grid-cols-2 gap-4 self-center text-base">
                <Stat label="💧 Humidity" value={`${weather.data.data.current.humidity}%`} />
                <Stat label="🌧️ Chance of rain" value={`${weather.data.data.current.rainChance}%`} />
                <Stat label="☔ Rain now" value={`${weather.data.data.current.rainfall} mm`} />
                <Stat label="💨 Wind" value={`${weather.data.data.current.windSpeed} km/h`} />
              </dl>
            </CardContent>
          </Card>

          <section aria-labelledby="advice" className="space-y-3">
            <h2 id="advice" className="text-xl font-semibold">
              What this means for your field
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {weather.data.data.advisories.map((advisory) => (
                <AdvisoryCard key={advisory.title} advisory={advisory} />
              ))}
            </div>
          </section>

          <section aria-labelledby="windows" className="space-y-3">
            <h2 id="windows" className="text-xl font-semibold">
              Coming days
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              {weather.data.data.windows.map((w) => (
                <Card key={w.label} className="rounded-3xl shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg">{w.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <Stat label="🌡️ Temperature" value={`${w.minTemp}° to ${w.maxTemp}°C`} />
                      <Stat label="🌧️ Highest rain chance" value={`${w.maxRainChance}%`} />
                      <Stat label="☔ Expected rainfall" value={`${w.totalRainfall} mm`} />
                      <Stat label="💧 Average humidity" value={`${w.avgHumidity}%`} />
                      <Stat label="💨 Strongest wind" value={`${w.maxWind} km/h`} />
                    </dl>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="hourly" className="space-y-3">
            <h2 id="hourly" className="text-xl font-semibold">
              Hour by hour
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {weather.data.data.hourly.slice(0, 24).map((hour) => (
                <div
                  key={hour.time}
                  className="min-w-28 shrink-0 rounded-2xl border border-border bg-card p-3 text-center"
                >
                  <p className="text-sm text-muted-foreground">
                    {new Date(hour.time).toLocaleTimeString([], { hour: "numeric" })}
                  </p>
                  <p className="text-2xl" aria-hidden>
                    {hour.emoji}
                  </p>
                  <p className="font-semibold">{hour.temperature}°C</p>
                  <p className="text-sm text-muted-foreground">🌧️ {hour.rainChance}%</p>
                </div>
              ))}
            </div>
          </section>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CloudSun className="size-4" aria-hidden />
            Updated {new Date(weather.data.data.fetchedAt).toLocaleString()} · refreshed automatically every 15 minutes.
          </p>
        </div>
      ) : null}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

function AdvisoryCard({ advisory }: { advisory: FarmAdvisory }) {
  const tone =
    advisory.tone === "danger"
      ? "border-destructive/40 bg-destructive/5"
      : advisory.tone === "warn"
        ? "border-harvest/50 bg-harvest/10"
        : "border-primary/30 bg-secondary/40";
  return (
    <Card className={`rounded-3xl ${tone}`}>
      <CardContent className="flex gap-3 p-5">
        <span className="text-2xl" aria-hidden>
          {advisory.emoji}
        </span>
        <div>
          <h3 className="text-base font-semibold">{advisory.title}</h3>
          <p className="text-muted-foreground">{advisory.detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function WeatherProblem({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="rounded-3xl border-destructive/40 bg-destructive/5">
      <CardContent className="space-y-3 p-6">
        <h2 className="text-lg font-semibold">Weather is not available right now</h2>
        <p className="text-muted-foreground">{message}</p>
        <Button variant="outline" className="rounded-2xl" onClick={onRetry}>
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}