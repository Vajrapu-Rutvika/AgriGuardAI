import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  preferred_language: string;
  notifications_enabled: boolean;
  voice_enabled: boolean;
};

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, preferred_language, notifications_enabled, voice_enabled")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, values: Partial<Omit<Profile, "id" | "email">>) {
  const { error } = await supabase.from("profiles").update(values).eq("id", userId);
  if (error) throw error;
}

export async function countFields(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("fields")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) throw error;
  return count ?? 0;
}

export async function landingRouteAfterAuth(userId: string): Promise<"/dashboard" | "/onboarding"> {
  try {
    return (await countFields(userId)) > 0 ? "/dashboard" : "/onboarding";
  } catch {
    return "/dashboard";
  }
}
