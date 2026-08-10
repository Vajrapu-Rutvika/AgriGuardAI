import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { landingRouteAfterAuth } from "@/lib/account";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in | AgriGuard AI" },
      { name: "description", content: "Log in to AgriGuard AI to see your fields, weather and crop guidance." },
      { property: "og:title", content: "Log in | AgriGuard AI" },
      { property: "og:description", content: "Log in to see your fields, weather and crop guidance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(72),
});

function LoginPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Wrong email or password. Please try again." : error.message);
      return;
    }
    toast.success("Welcome back 🌱");
    const to = await landingRouteAfterAuth(data.user.id);
    navigate({ to, replace: true });
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see your field guidance."
      footer={
        <span>
          New here?{" "}
          <Link to="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
            Create an account
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            className="h-12 rounded-2xl text-base"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            aria-invalid={!!errors["email"]}
          />
          {errors["email"] ? <p className="text-sm text-destructive">{errors["email"]}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-base">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            className="h-12 rounded-2xl text-base"
            value={values.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
            aria-invalid={!!errors["password"]}
          />
          {errors["password"] ? <p className="text-sm text-destructive">{errors["password"]}</p> : null}
        </div>
        <Button type="submit" size="lg" className="min-h-13 w-full rounded-2xl text-base" disabled={busy}>
          {busy ? "🌱 Logging you in..." : "Log in"}
        </Button>
        <p className="text-center">
          <Link to="/forgot-password" className="text-base text-primary underline-offset-4 hover:underline">
            Forgot your password?
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
