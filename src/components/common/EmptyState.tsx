import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Icon className="size-8" aria-hidden />
      </span>
      <div className="max-w-md space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}