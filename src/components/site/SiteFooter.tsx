import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-sm text-muted-foreground">
            A trusted digital farming companion built for farmers, in your own language.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-base">
          <Link to="/login" className="text-muted-foreground hover:text-foreground">
            Log in
          </Link>
          <Link to="/signup" className="text-muted-foreground hover:text-foreground">
            Create account
          </Link>
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
            Farmer dashboard
          </Link>
        </nav>
      </div>
    </footer>
  );
}