import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in | AgriGuard AI" },
      { name: "description", content: "Log in to AgriGuard AI to see your fields, weather and crop guidance." },
      { property: "og:title", content: "Log in | AgriGuard AI" },
      { property: "og:description", content: "Log in to see your fields, weather and crop guidance." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
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
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base">
            Mobile number or email
          </Label>
          <Input id="phone" name="phone" autoComplete="username" className="h-12 rounded-2xl text-base" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-base">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="h-12 rounded-2xl text-base"
          />
        </div>
        <Button type="submit" size="lg" className="min-h-13 w-full rounded-2xl text-base" disabled>
          Log in
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Accounts open in the next step. Nothing is stored yet.
        </p>
      </form>
    </AuthLayout>
  );
}