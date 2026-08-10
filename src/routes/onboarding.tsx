import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });
    return { user: data.user };
  },
  head: () => ({
    meta: [
      { title: "Set up your field | AgriGuard AI" },
      { name: "description", content: "Add your first field — crop, village and sowing date — to get guidance made for you." },
      { property: "og:title", content: "Set up your field | AgriGuard AI" },
      { property: "og:description", content: "Add your first field to get guidance made for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OnboardingPage,
});

const schema = z.object({
  name: z.string().trim().min(2, { message: "Give your field a short name" }).max(80),
  village: z.string().trim().max(120).optional().or(z.literal("")),
  crop: z.string().trim().max(80).optional().or(z.literal("")),
  sowing_date: z.string().max(20).optional().or(z.literal("")),
});

function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();
  const [values, setValues] = useState({ name: "", village: "", crop: "", sowing_date: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setBusy(true);
    const { error } = await supabase.from("fields").insert({
      user_id: user.id,
      name: parsed.data.name,
      village: parsed.data.village || null,
      crop: parsed.data.crop || null,
      sowing_date: parsed.data.sowing_date || null,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Your field is saved 🌾");
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="bg-field min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <Logo />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Let us set up your field</h1>
          <p className="text-lg text-muted-foreground">
            Add one field now. Every suggestion you get after this is made for your own field.
          </p>
        </div>
        <Card className="rounded-3xl shadow-soft">
          <CardContent className="p-6">
            <form className="space-y-5" onSubmit={onSubmit} noValidate>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">Field name</Label>
                <Input
                  id="name"
                  placeholder="Back field, Canal side..."
                  className="h-12 rounded-2xl text-base"
                  value={values.name}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                  aria-invalid={!!errors["name"]}
                />
                {errors["name"] ? <p className="text-sm text-destructive">{errors["name"]}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="village" className="text-base">Village</Label>
                <Input
                  id="village"
                  className="h-12 rounded-2xl text-base"
                  value={values.village}
                  onChange={(e) => setValues((v) => ({ ...v, village: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crop" className="text-base">Crop</Label>
                <Input
                  id="crop"
                  placeholder="Paddy, cotton, chilli..."
                  className="h-12 rounded-2xl text-base"
                  value={values.crop}
                  onChange={(e) => setValues((v) => ({ ...v, crop: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sowing_date" className="text-base">Sowing date</Label>
                <Input
                  id="sowing_date"
                  type="date"
                  className="h-12 rounded-2xl text-base"
                  value={values.sowing_date}
                  onChange={(e) => setValues((v) => ({ ...v, sowing_date: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" size="lg" className="min-h-13 rounded-2xl px-8 text-base" disabled={busy}>
                  {busy ? "Saving..." : "Save my field"}
                </Button>
                <SignOutButton className="min-h-13 rounded-2xl px-8 text-base" />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
