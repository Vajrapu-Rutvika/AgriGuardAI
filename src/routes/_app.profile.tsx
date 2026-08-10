import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LANGUAGES } from "@/lib/languages";
import { fetchProfile, updateProfile } from "@/lib/account";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Language | AgriGuard AI" },
      { name: "description", content: "Set your language, reminders and voice help for AgriGuard AI." },
      { property: "og:title", content: "Profile & Language | AgriGuard AI" },
      { property: "og:description", content: "Set your language, reminders and voice help." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

const nameSchema = z.string().trim().min(2, { message: "Please tell us your name" }).max(100);

function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
  });

  const [form, setForm] = useState({
    full_name: "",
    preferred_language: "en",
    notifications_enabled: true,
    voice_enabled: true,
  });
  const [nameError, setNameError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        full_name: data.full_name,
        preferred_language: data.preferred_language,
        notifications_enabled: data.notifications_enabled,
        voice_enabled: data.voice_enabled,
      });
    }
  }, [data]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    const parsed = nameSchema.safeParse(form.full_name);
    if (!parsed.success) {
      setNameError(parsed.error.issues[0]?.message ?? "Invalid name");
      return;
    }
    setNameError("");
    setSaving(true);
    try {
      await updateProfile(userId, { ...form, full_name: parsed.data });
      await queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      toast.success("Your details are saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save your details.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader emoji="👤" title="Profile" description="Your name, language and how we reach you." />
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <Card className="rounded-3xl shadow-soft">
          <CardContent className="p-6">
            <form className="space-y-6" onSubmit={onSave} noValidate>
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-base">Your full name</Label>
                <Input
                  id="full_name"
                  className="h-12 rounded-2xl text-base"
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  aria-invalid={!!nameError}
                />
                {nameError ? <p className="text-sm text-destructive">{nameError}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">Email</Label>
                <Input id="email" className="h-12 rounded-2xl text-base" value={data?.email ?? ""} readOnly disabled />
              </div>

              <fieldset className="space-y-2">
                <legend className="text-base font-medium">Preferred language</legend>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <Button
                      key={lang.value}
                      type="button"
                      variant={form.preferred_language === lang.value ? "default" : "outline"}
                      size="lg"
                      aria-pressed={form.preferred_language === lang.value}
                      className="min-h-12 rounded-2xl text-base"
                      onClick={() => setForm((f) => ({ ...f, preferred_language: lang.value }))}
                    >
                      {lang.label}
                    </Button>
                  ))}
                </div>
              </fieldset>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-border p-4">
                <div>
                  <Label htmlFor="notifications" className="text-base">Reminders and alerts</Label>
                  <p className="text-muted-foreground">Get told what to do, at the right time.</p>
                </div>
                <Switch
                  id="notifications"
                  checked={form.notifications_enabled}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, notifications_enabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-border p-4">
                <div>
                  <Label htmlFor="voice" className="text-base">Voice help</Label>
                  <p className="text-muted-foreground">Listen and speak instead of typing.</p>
                </div>
                <Switch
                  id="voice"
                  checked={form.voice_enabled}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, voice_enabled: checked }))}
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
                <Button type="submit" size="lg" className="min-h-13 rounded-2xl px-8 text-base" disabled={saving}>
                  {saving ? "Saving..." : "Save my details"}
                </Button>
                <SignOutButton className="min-h-13 rounded-2xl px-8 text-base" />
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
