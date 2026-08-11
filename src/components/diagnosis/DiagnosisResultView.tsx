import { AlertTriangle, Leaf, ShieldCheck, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { isLowConfidence, type DiagnosisResult } from "@/lib/diagnosis-types";

const severityLabel: Record<string, string> = {
  low: "Mild — keep watching",
  moderate: "Moderate — act this week",
  high: "Serious — act now",
  unknown: "Not clear from this photo",
};

function severityClasses(severity: string) {
  if (severity === "high") return "bg-destructive/10 text-destructive border-destructive/30";
  if (severity === "moderate") return "bg-harvest/20 text-foreground border-harvest/40";
  if (severity === "low") return "bg-secondary text-secondary-foreground border-border";
  return "bg-muted text-muted-foreground border-border";
}

export function DiagnosisResultView({ result }: { result: DiagnosisResult }) {
  const lowConfidence = isLowConfidence(result);

  return (
    <div className="space-y-4">
      {!result.usable_image ? (
        <Card className="rounded-3xl border-destructive/40 bg-destructive/5">
          <CardContent className="flex gap-3 p-6">
            <AlertTriangle className="mt-1 size-6 shrink-0 text-destructive" aria-hidden />
            <div>
              <h2 className="text-lg font-semibold">This photo could not be read properly</h2>
              <p className="text-muted-foreground">
                {result.image_note || "Please take a closer, brighter photo of the affected leaf or stem."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="overflow-hidden rounded-3xl shadow-soft">
        <CardHeader className="bg-secondary/50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Leaf className="size-5 text-primary" aria-hidden /> What we found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm uppercase tracking-wide text-muted-foreground">Crop</dt>
              <dd className="text-xl font-semibold">🌱 {result.crop}</dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-wide text-muted-foreground">Likely issue</dt>
              <dd className="text-xl font-semibold">{result.issue}</dd>
            </div>
          </dl>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-base font-medium">
              <span>How sure are we?</span>
              <span>{result.confidence}%</span>
            </div>
            <Progress value={result.confidence} aria-label="Confidence" />
          </div>

          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">How serious is it?</p>
            <Badge variant="outline" className={`mt-1 rounded-full px-4 py-1 text-base ${severityClasses(result.severity)}`}>
              {severityLabel[result.severity] ?? severityLabel["unknown"]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {lowConfidence ? (
        <Card className="rounded-3xl border-harvest/50 bg-harvest/10">
          <CardContent className="space-y-2 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <AlertTriangle className="size-5" aria-hidden /> Please do not act on this yet
            </h2>
            <p>AI confidence is low. Please upload a clearer and closer image before taking action.</p>
            {result.uncertainty_note ? <p className="text-muted-foreground">{result.uncertainty_note}</p> : null}
          </CardContent>
        </Card>
      ) : result.uncertainty_note ? (
        <p className="text-muted-foreground">{result.uncertainty_note}</p>
      ) : null}

      {result.expert_review_recommended || lowConfidence ? (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-border bg-card px-4 py-3">
          <Stethoscope className="size-5 text-primary" aria-hidden />
          <span className="font-medium">⚠️ Expert review recommended — show this to your local agriculture officer.</span>
        </div>
      ) : null}

      {result.symptoms.length ? (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg">What we can see in the photo</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5">
              {result.symptoms.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {result.alternatives.length ? (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg">Why might this be happening?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between font-medium">
                <span>{result.issue}</span>
                <span>{result.confidence}%</span>
              </div>
              <Progress value={result.confidence} />
            </div>
            {result.alternatives.map((alt) => (
              <div key={alt.name} className="space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>{alt.name}</span>
                  <span>{alt.confidence}%</span>
                </div>
                <Progress value={alt.confidence} />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {result.next_steps.length ? (
        <Card className="rounded-3xl border-primary/30 bg-secondary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="size-5 text-primary" aria-hidden /> What to do next
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-2 pl-5 text-base">
              {result.next_steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}