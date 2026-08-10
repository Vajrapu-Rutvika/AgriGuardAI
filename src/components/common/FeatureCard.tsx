import { Card, CardContent } from "@/components/ui/card";

export function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full rounded-3xl border-border/70 bg-card shadow-soft transition-transform hover:-translate-y-1">
      <CardContent className="space-y-2 p-6">
        <span aria-hidden className="text-3xl">
          {emoji}
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}