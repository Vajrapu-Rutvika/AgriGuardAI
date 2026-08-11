import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Camera, ImageOff, RefreshCcw, Sprout, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DiagnosisResultView } from "@/components/diagnosis/DiagnosisResultView";
import { useActiveField } from "@/hooks/useActiveField";
import { prepareImage, uploadCropPhoto, validateImageFile } from "@/lib/crop-photos";
import { diagnoseCrop } from "@/lib/diagnosis.functions";
import type { DiagnosisResult } from "@/lib/diagnosis-types";
import { saveDiagnosisEvent } from "@/lib/fields";

export const Route = createFileRoute("/_app/diagnosis")({
  head: () => ({
    meta: [
      { title: "Crop Diagnosis | AgriGuard AI" },
      { name: "description", content: "Take a photo of your crop leaf and get a clear explanation of what may be wrong." },
      { property: "og:title", content: "Crop Diagnosis | AgriGuard AI" },
      { property: "og:description", content: "Photo-based crop check with plain-language guidance." },
    ],
  }),
  component: DiagnosisPage,
});

function DiagnosisPage() {
  const { activeField, userId, isLoading } = useActiveField();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const runDiagnosis = useServerFn(diagnoseCrop);

  const reset = () => {
    setPreview(null);
    setQuality(null);
    setResult(null);
    setFailure(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    setResult(null);
    setFailure(null);
    const problem = validateImageFile(file);
    if (problem) {
      toast.error(problem);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    try {
      const { dataUrl, warning } = await prepareImage(file);
      setPreview(dataUrl);
      setQuality(warning);
    } catch {
      toast.error("This file could not be opened as a photo. Please choose another one.");
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!preview) throw new Error("Please add a crop photo first.");
      const response = await runDiagnosis({
        data: {
          imageDataUrl: preview,
          crop: activeField?.crop ?? null,
          growthStage: activeField?.growth_stage ?? null,
          village: activeField?.village ?? activeField?.location_text ?? null,
          knownProblem: activeField?.known_problem ?? null,
        },
      });
      if (!response.ok) throw new Error(response.error);

      if (userId && activeField && response.result.usable_image) {
        try {
          const imagePath = await uploadCropPhoto(userId, preview);
          await saveDiagnosisEvent({
            userId,
            fieldId: activeField.id,
            imagePath,
            crop: response.result.crop,
            issue: response.result.issue,
            confidence: response.result.confidence,
            severity: response.result.severity,
            symptoms: response.result.symptoms,
            alternatives: response.result.alternatives,
            recommendations: response.result.next_steps,
            uncertaintyNote: response.result.uncertainty_note,
            expertReview: response.result.expert_review_recommended,
          });
          void queryClient.invalidateQueries({ queryKey: ["diagnosis-events"] });
        } catch {
          toast.error("The check is done, but we could not save it to your field history.");
        }
      }
      return response.result;
    },
    onSuccess: (value) => {
      setResult(value);
      setFailure(null);
    },
    onError: (error: Error) => {
      setFailure(error.message || "Something went wrong. Please try again.");
    },
  });

  if (!isLoading && !activeField) {
    return (
      <>
        <DiagnosisHeader />
        <EmptyState
          icon={Sprout}
          title="No field added yet."
          description="Add your first field so every crop check can be saved to that field's history."
          action={
            <Button asChild size="lg" className="rounded-2xl">
              <Link to="/fields">Add my field</Link>
            </Button>
          }
        />
      </>
    );
  }

  return (
    <>
      <DiagnosisHeader />

      {activeField ? (
        <p className="rounded-2xl bg-secondary/50 px-4 py-3">
          🌾 Checking for <strong>{activeField.name}</strong>
          {activeField.crop ? ` · ${activeField.crop}` : ""}
          {activeField.village ? ` · ${activeField.village}` : ""}
        </p>
      ) : null}

      <Card className="rounded-3xl border-primary/20 bg-card shadow-soft">
        <CardContent className="space-y-4 p-6">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="sr-only"
            id="crop-photo"
            onChange={(event) => void onPick(event.target.files?.[0])}
          />

          {preview ? (
            <figure className="space-y-3">
              <img
                src={preview}
                alt="The crop photo you selected"
                className="max-h-96 w-full rounded-2xl border border-border object-contain bg-secondary/30"
              />
              {quality ? <figcaption className="text-muted-foreground">⚠️ {quality}</figcaption> : null}
            </figure>
          ) : (
            <label
              htmlFor="crop-photo"
              className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-secondary/30 px-6 py-14 text-center"
            >
              <Camera className="size-10 text-primary" aria-hidden />
              <span className="text-lg font-semibold">Add a photo of the affected leaf</span>
              <span className="text-muted-foreground">
                Come close to the leaf, keep it in daylight and keep the photo steady. JPG, PNG or WEBP up to 8 MB.
              </span>
            </label>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="rounded-2xl"
              disabled={!preview || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              <Upload className="size-5" aria-hidden /> Check my crop
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl"
              disabled={mutation.isPending}
              onClick={() => inputRef.current?.click()}
            >
              <RefreshCcw className="size-5" aria-hidden /> {preview ? "Replace photo" : "Choose photo"}
            </Button>
            {preview ? (
              <Button size="lg" variant="ghost" className="rounded-2xl" disabled={mutation.isPending} onClick={reset}>
                <ImageOff className="size-5" aria-hidden /> Remove photo
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {mutation.isPending ? (
        <Card className="rounded-3xl border-dashed">
          <CardContent className="flex flex-col items-center gap-2 p-10 text-center" role="status" aria-live="polite">
            <Sprout className="size-8 animate-pulse text-primary" aria-hidden />
            <p className="text-lg font-medium">🌱 Looking closely at your crop...</p>
            <p className="text-muted-foreground">This can take up to a minute. Please keep this screen open.</p>
          </CardContent>
        </Card>
      ) : null}

      {failure && !mutation.isPending ? (
        <Card className="rounded-3xl border-destructive/40 bg-destructive/5">
          <CardContent className="space-y-3 p-6">
            <h2 className="text-lg font-semibold">We could not finish the crop check</h2>
            <p className="text-muted-foreground">{failure}</p>
            <Button variant="outline" className="rounded-2xl" onClick={() => mutation.mutate()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {result && !mutation.isPending ? <DiagnosisResultView result={result} /> : null}
    </>
  );
}

function DiagnosisHeader() {
  return (
    <PageHeader
      emoji="📷"
      title="Crop Diagnosis"
      description="Take a clear photo of the affected leaf, stem or fruit. You will get an answer in simple words."
    />
  );
}