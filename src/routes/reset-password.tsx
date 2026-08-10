import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password | AgriGuard AI" },
      { name: "description", content: "Choose a new password for your AgriGuard AI farming account." },
      { property: "og:title", content: "Set a new password | AgriGuard AI" },
      { property: "og:description", content: "Choose a new password for your farming account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPasswordPage,
});

const schema = z
  .object({
    password: z.string().min(8, { message: "Use at least 8 characters" }).max(72),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Both passwords must match",
  });

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ password: "", confirmPassword: "" });
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
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Your password is updated.");
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose something you will remember.">
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-base">New password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            className="h-12 rounded-2xl text-base"
            value={values.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
            aria-invalid={!!errors.password}
          />
          {errors.password ? <p className="text-sm text-destructive">{errors.password}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-base">Type it again</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="h-12 rounded-2xl text-base"
            value={values.confirmPassword}
            onChange={(e) => setValues((v) => ({ ...v, confirmPassword: e.target.value }))}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword ? <p className="text-sm text-destructive">{errors.confirmPassword}</p> : null}
        </div>
        <Button type="submit" size="lg" className="min-h-13 w-full rounded-2xl text-base" disabled={busy}>
          {busy ? "Saving..." : "Save new password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
