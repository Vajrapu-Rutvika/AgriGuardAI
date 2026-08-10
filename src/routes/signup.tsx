import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account | AgriGuard AI" },
      { name: "description", content: "Create your AgriGuard AI account and add your first field in minutes." },
      { property: "og:title", content: "Create account | AgriGuard AI" },
      { property: "og:description", content: "Create your account and add your first field in minutes." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
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
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base">
            Your name
          </Label>
          <Input id="name" name="name" autoComplete="name" className="h-12 rounded-2xl text-base" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact" className="text-base">
            Mobile number or email
          </Label>
          <Input id="contact" name="contact" autoComplete="username" className="h-12 rounded-2xl text-base" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-base">
            Password
          </Label>
          <Input
            id="new-password"
            name="new-password"
            type="password"
            autoComplete="new-password"
            className="h-12 rounded-2xl text-base"
          />
        </div>
        <Button type="submit" size="lg" className="min-h-13 w-full rounded-2xl text-base" disabled>
          Create account
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Sign-up opens in the next step. Nothing is stored yet.
        </p>
        <Button asChild variant="outline" size="lg" className="w-full rounded-2xl">
          <Link to="/onboarding">See the setup steps</Link>
        </Button>
      </form>
    </AuthLayout>
  );
}