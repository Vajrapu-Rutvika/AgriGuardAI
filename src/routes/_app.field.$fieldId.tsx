import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getField, listFieldEvents, HEALTH_OPTIONS, type Field, type FieldEvent } from "@/lib/fields";
import { History } from "lucide-react";

export const Route = createFileRoute("/_app/field/$fieldId")({
  head: () => ({
    meta: [
      { title: "Field details | AgriGuard AI" },
      { name: "description", content: "See everything saved for this field — crop, stage, location, health and its own history." },
      { property: "og:title", content: "Field details | AgriGuard AI" },
      { property: "og:description", content: "See crop, stage, location, health and history for this field." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FieldDetailPage,
});

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b border-border/70 py-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value || "—"}</dd>
    </div>
  );
}

function FieldDetailPage() {
  const { fieldId } = Route.useParams();
  const [field, setField] = useState<Field | null | undefined>(undefined);
  const [events, setEvents] = useState<FieldEvent[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [f, e] = await Promise.all([getField(fieldId), listFieldEvents(fieldId)]);
        if (cancelled) return;
        setField(f);
        setEvents(e);
      } catch (err) {
        if (!cancelled) {
          setField(null);
          toast.error(err instanceof Error ? err.message : "Could not load this field.");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [fieldId]);

  if (field === undefined) {
    return <p className="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center text-lg">🌱 Preparing your field insights...</p>;
  }

  if (field === null) {
    return (
      <EmptyState
        icon={History}
        title="This field is not available."
        description="It may have been removed. Go back to My Fields to see your farm."
        action={<Button asChild className="min-h-12 rounded-2xl text-base"><Link to="/fields">Back to My Fields</Link></Button>}
      />
    );
  }

  const health = HEALTH_OPTIONS.find((h) => h.value === field.health_status)?.label ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🌾"
        title={field.name}
        description={field.is_active ? "This is your active field." : "Field details"}
        actions={<Button asChild variant="outline" className="min-h-12 rounded-2xl text-base"><Link to="/fields">Back to My Fields</Link></Button>}
      />
      <Card className="rounded-3xl shadow-soft">
        <CardContent className="p-5 text-base">
          <dl>
            <Row label="Field size" value={field.size != null ? `${field.size} ${field.size_unit}` : null} />
            <Row label="📍 Village" value={field.village} />
            <Row label="Mandal / district" value={field.location_text} />
            <Row label="GPS location" value={field.latitude != null && field.longitude != null ? `${field.latitude}, ${field.longitude}` : null} />
            <Row label="🌱 Crop" value={field.crop} />
            <Row label="Variety" value={field.crop_variety} />
            <Row label="🌿 Crop stage" value={field.growth_stage} />
            <Row label="Sowing date" value={field.sowing_date} />
            <Row label="❤️ Crop health" value={health} />
            <Row label="Known problem" value={field.known_problem} />
            <Row label="Notes" value={field.notes} />
          </dl>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">📖 Field history</h2>
        {events.length === 0 ? (
          <EmptyState
            icon={History}
            title="No history for this field yet."
            description="Diagnoses, weather notes, recommendations and recovery updates for this field will appear here as you use AgriGuard AI."
          />
        ) : (
          <ul className="space-y-3">
            {events.map((e) => (
              <li key={e.id}>
                <Card className="rounded-3xl">
                  <CardContent className="space-y-1 p-4">
                    <p className="text-sm text-muted-foreground">{new Date(e.occurred_at).toLocaleString()} · {e.event_type}</p>
                    <p className="text-base font-semibold">{e.title ?? e.event_type}</p>
                    {e.summary ? <p className="text-base text-muted-foreground">{e.summary}</p> : null}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
