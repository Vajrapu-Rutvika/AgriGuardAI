import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { TalkToFieldButton } from "@/components/app/TalkToFieldButton";
import { primaryNav, secondaryNav, mobileNav, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function useActivePath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function SideLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={cn(
        "flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2.5 text-base font-medium transition-colors",
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden />
      <span>{item.label}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useActivePath();

  return (
    <div className="min-h-screen bg-field">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur md:hidden">
        <Logo to="/dashboard" />
        <Button asChild variant="outline" size="sm">
          <Link to="/profile">Profile</Link>
        </Button>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar px-4 py-6 md:flex">
          <Logo to="/dashboard" className="px-2" />
          <nav aria-label="Main" className="flex flex-1 flex-col gap-1 overflow-y-auto">
            {primaryNav.map((item) => (
              <SideLink key={item.to} item={item} active={pathname === item.to} />
            ))}
            <p className="mt-5 px-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Field tools
            </p>
            {secondaryNav.map((item) => (
              <SideLink key={item.to} item={item} active={pathname === item.to} />
            ))}
          </nav>
          <Button asChild variant="outline" size="lg" className="rounded-2xl">
            <Link to="/">Back to website</Link>
          </Button>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-16">
          <div className="mx-auto w-full max-w-5xl space-y-6">{children}</div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card px-1 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {mobileNav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-xs font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-6" aria-hidden />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <TalkToFieldButton />
    </div>
  );
}