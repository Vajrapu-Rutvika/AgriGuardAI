import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  emoji,
  actions,
}: {
  title: string;
  description?: string;
  emoji?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          {emoji ? <span aria-hidden className="mr-2">{emoji}</span> : null}
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}