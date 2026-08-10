import { Button } from "@/components/ui/button";
import { CloudOff } from "lucide-react";

export function ErrorState({
  title = "We could not load this right now",
  description = "Please check your internet and try again. Your field data is safe.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card px-6 py-12 text-center">
      <CloudOff className="size-10 text-warning" aria-hidden />
      <div className="max-w-md space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {onRetry ? (
        <Button size="lg" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}