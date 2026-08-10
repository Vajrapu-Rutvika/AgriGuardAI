import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({ message = "🌱 Preparing your field insights..." }: { message?: string }) {
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <p className="text-center text-lg font-medium text-muted-foreground">{message}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-28 rounded-3xl" />
        <Skeleton className="h-28 rounded-3xl" />
        <Skeleton className="h-28 rounded-3xl" />
        <Skeleton className="h-28 rounded-3xl" />
      </div>
    </div>
  );
}