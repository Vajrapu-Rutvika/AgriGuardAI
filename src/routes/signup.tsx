import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { LANGUAGES } from "@/lib/languages";
import { landingRouteAfterAuth } from "@/lib/account";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account | AgriGuard AI" },
      { name: "description", content: "Create your AgriGuard AI account and add your first field in minutes." },
      { property: "og:title", content: "Create account | AgriGuard AI" },
      { property: "og:description", content: "Create your account and add your first field in minutes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

const schema = z
  .object({
    fullName: z.string().trim().min(2, { message: "Please tell us your name" }).max(100),
    email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
    password: z.string().min(8, { message: "Use at least 8 characters" }).max(72),
    confirmPassword: z.string(),
    language: z.enum(["te", "hi", "en"]),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Both passwords must match",
  });

function SignupPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    language: "en" as "te" | "hi" | "en",
  });
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
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: parsed.data.fullName, preferred_language: parsed.data.language },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      toast.success("Almost done — please check your email to confirm your account.");
      navigate({ to: "/login" });
      return;
    }
    toast.success("Your account is ready 🌱");
    const to = await landingRouteAfterAuth(data.session.user.id);
    navigate({ to, replace: true });
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start with one field. It takes two minutes."
      footer={
        <span>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-base">Your full name</Label>
          <Input
            id="fullName"
            autoComplete="name"
            className="h-12 rounded-2xl text-base"
            value={values.fullName}
            onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName ? <p className="text-sm text-destructive">{errors.fullName}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            className="h-12 rounded-2xl text-base"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            aria-invalid={!!errors.email}
          />
          {errors.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-base">Password</Label>
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
          <Label htmlFor="confirmPassword" className="text-base">Type your password again</Label>
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
        <fieldset className="space-y-2">
          <legend className="text-base font-medium">Preferred language</legend>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <Button
                key={lang.value}
                type="button"
                variant={values.language === lang.value ? "default" : "outline"}
                size="lg"
                aria-pressed={values.language === lang.value}
                className={cn("min-h-12 rounded-2xl text-base")}
                onClick={() => setValues((v) => ({ ...v, language: lang.value }))}
              >
                {lang.label}
              </Button>
            ))}
          </div>
        </fieldset>
        <Button type="submit" size="lg" className="min-h-13 w-full rounded-2xl text-base" disabled={busy}>
          {busy ? "🌱 Creating your account..." : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
