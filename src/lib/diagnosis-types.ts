export type DiagnosisAlternative = { name: string; confidence: number };

export type DiagnosisResult = {
  usable_image: boolean;
  image_quality: "good" | "fair" | "poor";
  image_note: string;
  crop: string;
  issue: string;
  confidence: number;
  severity: "low" | "moderate" | "high" | "unknown";
  symptoms: string[];
  alternatives: DiagnosisAlternative[];
  uncertainty_note: string;
  expert_review_recommended: boolean;
  next_steps: string[];
};

export type DiagnosisResponse =
  | { ok: true; result: DiagnosisResult }
  | { ok: false; error: string };

export const LOW_CONFIDENCE_THRESHOLD = 65;

export function isLowConfidence(result: DiagnosisResult): boolean {
  if (!result.usable_image) return true;
  if (result.confidence < LOW_CONFIDENCE_THRESHOLD) return true;
  const top = result.alternatives[0];
  return Boolean(top && result.confidence - top.confidence < 15);
}