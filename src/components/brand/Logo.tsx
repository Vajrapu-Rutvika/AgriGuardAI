import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link to={to} className={cn("flex items-center gap-2.5", className)} aria-label="AgriGuard AI home">
      <span className="bg-leaf-gradient flex size-10 items-center justify-center rounded-2xl text-primary-foreground shadow-soft">
        <Leaf className="size-5" aria-hidden />
      </span>
      <span className="font-display text-xl font-bold leading-none text-foreground">
        AgriGuard <span className="text-primary">AI</span>
      </span>
    </Link>
  );
}