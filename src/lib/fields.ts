import { supabase } from "@/integrations/supabase/client";

export type Field = {
  id: string;
  user_id: string;
  name: string;
  village: string | null;
  size: number | null;
  size_unit: string;
  location_text: string | null;
  latitude: number | null;
  longitude: number | null;
  crop: string | null;
  crop_variety: string | null;
  growth_stage: string | null;
  sowing_date: string | null;
  health_status: string | null;
  known_problem: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type FieldInput = {
  name: string;
  size: number | null;
  size_unit: string;
  location_text: string | null;
  village: string | null;
  latitude: number | null;
  longitude: number | null;
  crop: string | null;
  crop_variety: string | null;
  growth_stage: string | null;
  sowing_date: string | null;
  health_status: string | null;
  known_problem: string | null;
  notes: string | null;
};

export const GROWTH_STAGES = [
  "Just sown",
  "Seedling",
  "Vegetative growth",
  "Flowering",
  "Fruiting / grain filling",
  "Ready to harvest",
] as const;

export const HEALTH_OPTIONS = [
  { value: "healthy", label: "Healthy — crop looks good", tone: "safe" },
  { value: "watch", label: "Something looks off", tone: "warn" },
  { value: "problem", label: "Clear problem in the field", tone: "danger" },
] as const;

export const SIZE_UNITS = ["acre", "hectare", "guntha", "bigha"] as const;

export async function listFields(userId: string): Promise<Field[]> {
  const { data, error } = await supabase
    .from("fields")
    .select("*")
    .eq("user_id", userId)
    .order("is_active", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Field[];
}

export async function getField(fieldId: string): Promise<Field | null> {
  const { data, error } = await supabase.from("fields").select("*").eq("id", fieldId).maybeSingle();
  if (error) throw error;
  return (data as Field) ?? null;
}

export async function createField(userId: string, input: FieldInput, makeActive: boolean) {
  if (makeActive) await clearActive(userId);
  const { data, error } = await supabase
    .from("fields")
    .insert({ user_id: userId, ...input, is_active: makeActive })
    .select("*")
    .single();
  if (error) throw error;
  return data as Field;
}

export async function updateField(fieldId: string, input: Partial<FieldInput>) {
  const { error } = await supabase.from("fields").update(input).eq("id", fieldId);
  if (error) throw error;
}

export async function deleteField(fieldId: string) {
  const { error } = await supabase.from("fields").delete().eq("id", fieldId);
  if (error) throw error;
}

async function clearActive(userId: string) {
  const { error } = await supabase
    .from("fields")
    .update({ is_active: false })
    .eq("user_id", userId)
    .eq("is_active", true);
  if (error) throw error;
}

export async function setActiveField(userId: string, fieldId: string) {
  await clearActive(userId);
  const { error } = await supabase.from("fields").update({ is_active: true }).eq("id", fieldId);
  if (error) throw error;
}

export type FieldEvent = {
  id: string;
  field_id: string;
  event_type: string;
  occurred_at: string;
  title: string | null;
  summary: string | null;
  severity: string | null;
  recovery_status: string | null;
};

export async function listFieldEvents(fieldId: string): Promise<FieldEvent[]> {
  const { data, error } = await supabase
    .from("field_events")
    .select("id, field_id, event_type, occurred_at, title, summary, severity, recovery_status")
    .eq("field_id", fieldId)
    .order("occurred_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as FieldEvent[];
}
