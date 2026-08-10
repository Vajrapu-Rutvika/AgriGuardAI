import { Card, CardContent } from "@/components/ui/card";
import { Sprout } from "lucide-react";

/**
 * Honest placeholder: this screen is ready, but real data is not connected yet.
 * Never present sample numbers here as if they were real field results.
 */
export function ComingSoon({ feature, note }: { feature: string; note?: string }) {
  return (
    <Card className="rounded-3xl border-dashed bg-card">
      <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
        <Sprout className="size-8 text-primary" aria-hidden />
        <h2 className="text-lg font-semibold">{feature} is being prepared</h2>
        <p className="max-w-lg text-muted-foreground">
          {note ??
            "This screen is ready. Real field data and guidance will appear here once your fields and sensors are connected."}
        </p>
      </CardContent>
    </Card>
  );
}