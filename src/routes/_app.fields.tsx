import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FieldWizard } from "@/components/fields/FieldWizard";
import { HEALTH_OPTIONS, createField, deleteField, listFields, setActiveField, updateField, type Field, type FieldInput } from "@/lib/fields";
import { Sprout, MapPin, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/fields")({
  head: () => ({
    meta: [
      { title: "My Fields | AgriGuard AI" },
      { name: "description", content: "Add, edit and manage your fields — crop, stage, location and field health." },
      { property: "og:title", content: "My Fields | AgriGuard AI" },
      { property: "og:description", content: "Add, edit and manage your fields, crops and field health." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FieldsPage,
});

function healthLabel(value: string | null) {
  return HEALTH_OPTIONS.find((h) => h.value === value)?.label ?? null;
}

function FieldCard({
  field, onEdit, onDelete, onActivate, busy,
}: {
  field: Field;
  onEdit: () => void;
  onDelete: () => void;
  onActivate: () => void;
  busy: boolean;
}) {
  return (
    <Card className="rounded-3xl shadow-soft">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold">🌾 {field.name}</h2>
            <p className="text-muted-foreground">
              {[field.crop, field.growth_stage].filter(Boolean).join(" · ") || "Crop details not added yet"}
            </p>
          </div>
          {field.is_active ? (
            <Badge className="rounded-full px-3 py-1 text-sm">
              <CheckCircle2 className="mr-1 size-4" aria-hidden /> Active field
            </Badge>
          ) : null}
        </div>
        <dl className="grid gap-x-6 gap-y-1 text-base sm:grid-cols-2">
          {field.size != null ? (
            <div className="flex justify-between gap-2 sm:block">
              <dt className="text-muted-foreground">Size</dt>
              <dd className="font-medium">{field.size} {field.size_unit}</dd>
            </div>
          ) : null}
          {field.village || field.location_text ? (
            <div className="flex justify-between gap-2 sm:block">
              <dt className="text-muted-foreground"><MapPin className="mr-1 inline size-4" aria-hidden />Location</dt>
              <dd className="font-medium">{[field.village, field.location_text].filter(Boolean).join(", ")}</dd>
            </div>
          ) : null}
          {healthLabel(field.health_status) ? (
            <div className="flex justify-between gap-2 sm:block">
              <dt className="text-muted-foreground">Crop health</dt>
              <dd className="font-medium">{healthLabel(field.health_status)}</dd>
            </div>
          ) : null}
          {field.sowing_date ? (
            <div className="flex justify-between gap-2 sm:block">
              <dt className="text-muted-foreground">Sown on</dt>
              <dd className="font-medium">{field.sowing_date}</dd>
            </div>
          ) : null}
        </dl>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="min-h-12 rounded-2xl text-base">
            <Link to="/field/$fieldId" params={{ fieldId: field.id }}>View details</Link>
          </Button>
          <Button variant="outline" className="min-h-12 rounded-2xl text-base" onClick={onEdit}>Edit</Button>
          {!field.is_active ? (
            <Button variant="secondary" className="min-h-12 rounded-2xl text-base" onClick={onActivate} disabled={busy}>
              Make active
            </Button>
          ) : null}
          <Button variant="ghost" className="min-h-12 rounded-2xl text-base text-destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FieldsPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[] | null>(null);
  const [mode, setMode] = useState<{ kind: "list" } | { kind: "add" } | { kind: "edit"; field: Field }>({ kind: "list" });
  const [pendingDelete, setPendingDelete] = useState<Field | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setFields(await listFields(user.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load your fields.");
      setFields([]);
    }
  }, [user.id]);

  useEffect(() => { void load(); }, [load]);

  async function handleCreate(input: FieldInput) {
    try {
      await createField(user.id, input, (fields?.length ?? 0) === 0);
      toast.success("Field added 🌾");
      setMode({ kind: "list" });
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save the field.");
    }
  }

  async function handleUpdate(fieldId: string, input: FieldInput) {
    try {
      await updateField(fieldId, input);
      toast.success("Field updated");
      setMode({ kind: "list" });
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the field.");
    }
  }

  async function handleActivate(field: Field) {
    setBusy(true);
    try {
      await setActiveField(user.id, field.id);
      toast.success(`${field.name} is now your active field`);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change the active field.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await deleteField(pendingDelete.id);
      toast.success("Field removed");
      setPendingDelete(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the field.");
    }
  }

  if (mode.kind === "add" || mode.kind === "edit") {
    const editing = mode.kind === "edit" ? mode.field : undefined;
    return (
      <div className="space-y-6">
        <PageHeader
          emoji="🌾"
          title={editing ? `Edit ${editing.name}` : "Add a new field"}
          description="Farm → Location → Crop → Crop stage → Crop health → Ready"
        />
        <FieldWizard
          initial={editing}
          submitLabel={editing ? "Save changes" : "Save field"}
          onSubmit={(input) => (editing ? handleUpdate(editing.id, input) : handleCreate(input))}
          onCancel={() => setMode({ kind: "list" })}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🌱"
        title="My Fields"
        description="Every guidance you receive is based on the fields you add here."
        actions={
          <Button size="lg" className="min-h-12 rounded-2xl text-base" onClick={() => setMode({ kind: "add" })}>
            Add field
          </Button>
        }
      />

      {fields === null ? (
        <p className="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center text-lg">
          🌱 Preparing your field insights...
        </p>
      ) : fields.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="No field added yet."
          description="Add your first field to start receiving personalized farming guidance."
          action={
            <Button size="lg" className="min-h-12 rounded-2xl text-base" onClick={() => navigate({ to: "/onboarding" })}>
              Set up my farm
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {fields.map((field) => (
            <FieldCard
              key={field.id}
              field={field}
              busy={busy}
              onEdit={() => setMode({ kind: "edit", field })}
              onActivate={() => void handleActivate(field)}
              onDelete={() => setPendingDelete(field)}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this field?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name} and its saved field history will be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-12 rounded-2xl text-base">Keep field</AlertDialogCancel>
            <AlertDialogAction className="min-h-12 rounded-2xl text-base" onClick={() => void handleDelete()}>
              Yes, remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
