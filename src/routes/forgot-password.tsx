import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password | AgriGuard AI" },
      { name: "description", content: "Send yourself a reset link and get back into your AgriGuard AI account." },
      { property: "og:title", content: "Reset your password | AgriGuard AI" },
      { property: "og:description", content: "Send yourself a reset link and get back into your account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForgotPasswordPage,
});

const schema = z.string().trim().email({ message: "Please enter a valid email address" }).max(255);

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setError("");
    setBusy(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (err) {
      toast.error(err.message);
      return;
    }
    setSent(true);
    toast.success("Reset link sent. Please check your email.");
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="We will email you a link to set a new one."
      footer={
        <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <p className="text-center text-base text-muted-foreground">
          If an account uses <span className="font-semibold text-foreground">{email}</span>, a reset link is on its
          way. Open it on this device to set a new password.
        </p>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              className="h-12 rounded-2xl text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
          <Button type="submit" size="lg" className="min-h-13 w-full rounded-2xl text-base" disabled={busy}>
            {busy ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
