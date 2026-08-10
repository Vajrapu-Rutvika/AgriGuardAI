import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { GROWTH_STAGES, HEALTH_OPTIONS, SIZE_UNITS, type Field, type FieldInput } from "@/lib/fields";
import { LocateFixed } from "lucide-react";

const STEPS = [
  { key: "farm", emoji: "🌾", label: "Farm" },
  { key: "crop", emoji: "🌱", label: "Crop" },
  { key: "health", emoji: "❤️", label: "Crop Health" },
  { key: "review", emoji: "✅", label: "Ready" },
] as const;

type FormValues = {
  name: string;
  size: string;
  size_unit: string;
  location_text: string;
  village: string;
  latitude: number | null;
  longitude: number | null;
  crop: string;
  crop_variety: string;
  growth_stage: string;
  sowing_date: string;
  health_status: string;
  known_problem: string;
  notes: string;
};

const empty: FormValues = {
  name: "", size: "", size_unit: "acre", location_text: "", village: "",
  latitude: null, longitude: null, crop: "", crop_variety: "", growth_stage: "",
  sowing_date: "", health_status: "", known_problem: "", notes: "",
};

function fromField(field: Field): FormValues {
  return {
    name: field.name ?? "",
    size: field.size == null ? "" : String(field.size),
    size_unit: field.size_unit ?? "acre",
    location_text: field.location_text ?? "",
    village: field.village ?? "",
    latitude: field.latitude,
    longitude: field.longitude,
    crop: field.crop ?? "",
    crop_variety: field.crop_variety ?? "",
    growth_stage: field.growth_stage ?? "",
    sowing_date: field.sowing_date ?? "",
    health_status: field.health_status ?? "",
    known_problem: field.known_problem ?? "",
    notes: field.notes ?? "",
  };
}

const stepSchemas = [
  z.object({
    name: z.string().trim().min(2, { message: "Give your field a short name" }).max(80),
    size: z
      .string()
      .trim()
      .refine((v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) > 0 && Number(v) < 100000), {
        message: "Enter the size as a number",
      }),
  }),
  z.object({
    crop: z.string().trim().max(80),
    sowing_date: z.string().max(20),
  }),
  z.object({ known_problem: z.string().trim().max(300), notes: z.string().trim().max(1000) }),
];

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
      {STEPS.map((s, i) => (
        <li key={s.key} className="flex items-center gap-2">
          <span
            className={cn(
              "flex min-h-10 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold",
              i === current
                ? "bg-primary text-primary-foreground"
                : i < current
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground",
            )}
          >
            <span aria-hidden>{s.emoji}</span>
            {s.label}
          </span>
          {i < STEPS.length - 1 ? <span aria-hidden className="text-muted-foreground">→</span> : null}
        </li>
      ))}
    </ol>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b border-border/70 py-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value || "—"}</dd>
    </div>
  );
}

export function FieldWizard({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Field | undefined;
  submitLabel: string;
  onSubmit: (input: FieldInput) => Promise<void>;
  onCancel?: (() => void) | undefined;
}) {
  const [values, setValues] = useState<FormValues>(initial ? fromField(initial) : empty);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);

  const set = (patch: Partial<FormValues>) => setValues((v) => ({ ...v, ...patch }));

  function next() {
    const schema = stepSchemas[step];
    if (schema) {
      const parsed = schema.safeParse(values);
      if (!parsed.success) {
        const nextErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) nextErrors[String(issue.path[0])] = issue.message;
        setErrors(nextErrors);
        return;
      }
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function useGps() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Your device did not share the location. Please type it below.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        set({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        });
        toast.success("Location saved from your phone 📍");
      },
      () => {
        setLocating(false);
        toast.error("Could not get your location. Please type your village instead.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function save() {
    setBusy(true);
    try {
      await onSubmit({
        name: values.name.trim(),
        size: values.size.trim() === "" ? null : Number(values.size),
        size_unit: values.size_unit,
        location_text: values.location_text.trim() || null,
        village: values.village.trim() || null,
        latitude: values.latitude,
        longitude: values.longitude,
        crop: values.crop.trim() || null,
        crop_variety: values.crop_variety.trim() || null,
        growth_stage: values.growth_stage || null,
        sowing_date: values.sowing_date || null,
        health_status: values.health_status || null,
        known_problem: values.known_problem.trim() || null,
        notes: values.notes.trim() || null,
      });
    } finally {
      setBusy(false);
    }
  }

  const healthLabel = HEALTH_OPTIONS.find((h) => h.value === values.health_status)?.label ?? "";

  return (
    <Card className="rounded-3xl shadow-soft">
      <CardContent className="space-y-6 p-5 sm:p-6">
        <Stepper current={step} />

        {step === 0 ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">🌾 Field / farm name</Label>
              <Input
                id="name" className="h-12 rounded-2xl text-base" placeholder="Back field, Canal side..."
                value={values.name} onChange={(e) => set({ name: e.target.value })}
                aria-invalid={!!errors["name"]}
              />
              {errors["name"] ? <p className="text-sm text-destructive">{errors["name"]}</p> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="size" className="text-base">Field size</Label>
                <Input
                  id="size" inputMode="decimal" className="h-12 rounded-2xl text-base" placeholder="2.5"
                  value={values.size} onChange={(e) => set({ size: e.target.value })}
                  aria-invalid={!!errors["size"]}
                />
                {errors["size"] ? <p className="text-sm text-destructive">{errors["size"]}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="size_unit" className="text-base">Measured in</Label>
                <select
                  id="size_unit"
                  className="h-12 w-full rounded-2xl border border-input bg-background px-4 text-base"
                  value={values.size_unit} onChange={(e) => set({ size_unit: e.target.value })}
                >
                  {SIZE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-3 rounded-2xl bg-secondary/50 p-4">
              <p className="text-base font-semibold">📍 Where is this field?</p>
              <Button type="button" variant="outline" size="lg" className="min-h-12 rounded-2xl" onClick={useGps} disabled={locating}>
                <LocateFixed className="size-5" aria-hidden />
                {locating ? "Finding your field..." : "Use my current location"}
              </Button>
              {values.latitude != null && values.longitude != null ? (
                <p className="text-sm text-muted-foreground">
                  Saved location: {values.latitude}, {values.longitude}
                </p>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="village" className="text-base">Village</Label>
                  <Input id="village" className="h-12 rounded-2xl text-base" value={values.village}
                    onChange={(e) => set({ village: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location_text" className="text-base">Mandal / district</Label>
                  <Input id="location_text" className="h-12 rounded-2xl text-base" value={values.location_text}
                    onChange={(e) => set({ location_text: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="crop" className="text-base">🌱 Crop</Label>
                <Input id="crop" placeholder="Paddy, cotton, chilli..." className="h-12 rounded-2xl text-base"
                  value={values.crop} onChange={(e) => set({ crop: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crop_variety" className="text-base">Variety (optional)</Label>
                <Input id="crop_variety" className="h-12 rounded-2xl text-base" value={values.crop_variety}
                  onChange={(e) => set({ crop_variety: e.target.value })} />
              </div>
            </div>
            <fieldset className="space-y-2">
              <legend className="mb-2 text-base font-medium">🌿 Crop stage right now</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {GROWTH_STAGES.map((s) => (
                  <button
                    key={s} type="button" onClick={() => set({ growth_stage: s })}
                    className={cn(
                      "min-h-13 rounded-2xl border px-4 text-left text-base",
                      values.growth_stage === s ? "border-primary bg-primary/10 font-semibold" : "border-border bg-background",
                    )}
                    aria-pressed={values.growth_stage === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="space-y-2">
              <Label htmlFor="sowing_date" className="text-base">Sowing date</Label>
              <Input id="sowing_date" type="date" className="h-12 rounded-2xl text-base" value={values.sowing_date}
                onChange={(e) => set({ sowing_date: e.target.value })} />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <fieldset>
              <legend className="mb-2 text-base font-medium">❤️ How does the crop look today?</legend>
              <div className="space-y-2">
                {HEALTH_OPTIONS.map((h) => (
                  <button
                    key={h.value} type="button" onClick={() => set({ health_status: h.value })}
                    className={cn(
                      "flex min-h-13 w-full items-center rounded-2xl border px-4 text-left text-base",
                      values.health_status === h.value ? "border-primary bg-primary/10 font-semibold" : "border-border bg-background",
                    )}
                    aria-pressed={values.health_status === h.value}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="space-y-2">
              <Label htmlFor="known_problem" className="text-base">Known disease or problem</Label>
              <Input id="known_problem" placeholder="Leaf spots, stem borer, yellowing..." className="h-12 rounded-2xl text-base"
                value={values.known_problem} onChange={(e) => set({ known_problem: e.target.value })} />
              {errors["known_problem"] ? <p className="text-sm text-destructive">{errors["known_problem"]}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base">Anything else about this field</Label>
              <Textarea id="notes" rows={4} className="rounded-2xl text-base" value={values.notes}
                onChange={(e) => set({ notes: e.target.value })} />
              {errors["notes"] ? <p className="text-sm text-destructive">{errors["notes"]}</p> : null}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <p className="text-base text-muted-foreground">Please check your field details once before saving.</p>
            <dl className="rounded-2xl bg-secondary/40 p-4 text-base">
              <Row label="🌾 Field name" value={values.name} />
              <Row label="Field size" value={values.size ? `${values.size} ${values.size_unit}` : ""} />
              <Row label="📍 Village" value={values.village} />
              <Row label="Mandal / district" value={values.location_text} />
              <Row
                label="GPS location"
                value={values.latitude != null && values.longitude != null ? `${values.latitude}, ${values.longitude}` : ""}
              />
              <Row label="🌱 Crop" value={values.crop} />
              <Row label="Variety" value={values.crop_variety} />
              <Row label="🌿 Crop stage" value={values.growth_stage} />
              <Row label="Sowing date" value={values.sowing_date} />
              <Row label="❤️ Crop health" value={healthLabel} />
              <Row label="Known problem" value={values.known_problem} />
              <Row label="Notes" value={values.notes} />
            </dl>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex gap-3">
            {step > 0 ? (
              <Button type="button" variant="outline" size="lg" className="min-h-13 rounded-2xl px-6 text-base"
                onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            ) : null}
            {onCancel ? (
              <Button type="button" variant="ghost" size="lg" className="min-h-13 rounded-2xl px-6 text-base" onClick={onCancel}>
                Cancel
              </Button>
            ) : null}
          </div>
          {step < STEPS.length - 1 ? (
            <Button type="button" size="lg" className="min-h-13 rounded-2xl px-8 text-base" onClick={next}>
              Continue
            </Button>
          ) : (
            <Button type="button" size="lg" className="min-h-13 rounded-2xl px-8 text-base" onClick={save} disabled={busy}>
              {busy ? "Saving..." : submitLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
