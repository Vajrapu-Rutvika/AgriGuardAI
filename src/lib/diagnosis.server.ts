import type { DiagnosisResponse, DiagnosisResult } from "./diagnosis-types";
import type { DiagnosisInput } from "./diagnosis.functions";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "openai/gpt-5.6-sol";

const schema = {
  type: "object",
  additionalProperties: false,
  required: [
    "usable_image",
    "image_quality",
    "image_note",
    "crop",
    "issue",
    "confidence",
    "severity",
    "symptoms",
    "alternatives",
    "uncertainty_note",
    "expert_review_recommended",
    "next_steps",
  ],
  properties: {
    usable_image: { type: "boolean" },
    image_quality: { type: "string", enum: ["good", "fair", "poor"] },
    image_note: { type: "string" },
    crop: { type: "string" },
    issue: { type: "string" },
    confidence: { type: "number" },
    severity: { type: "string", enum: ["low", "moderate", "high", "unknown"] },
    symptoms: { type: "array", items: { type: "string" } },
    alternatives: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "confidence"],
        properties: { name: { type: "string" }, confidence: { type: "number" } },
      },
    },
    uncertainty_note: { type: "string" },
    expert_review_recommended: { type: "boolean" },
    next_steps: { type: "array", items: { type: "string" } },
  },
} as const;

function buildContext(data: DiagnosisInput): string {
  const bits = [
    data.crop ? `Farmer says the crop is: ${data.crop}` : null,
    data.growthStage ? `Growth stage: ${data.growthStage}` : null,
    data.village ? `Location: ${data.village}` : null,
    data.knownProblem ? `Problem the farmer already noticed: ${data.knownProblem}` : null,
  ].filter(Boolean);
  return bits.length ? bits.join("\n") : "No extra field details were provided.";
}

export async function runCropDiagnosis(data: DiagnosisInput): Promise<DiagnosisResponse> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return { ok: false, error: "The crop checking service is not configured yet." };

  const systemPrompt = [
    "You are an experienced Indian agronomist helping a small farmer read a photo of their crop.",
    "Speak in short, plain sentences a farmer can understand. No jargon, no medical language.",
    "If the photo is blurry, too far away, too dark, or is not a plant, set usable_image to false and explain simply.",
    "confidence is 0-100 for the most likely issue. alternatives are other possible causes with their own 0-100 confidence, highest first, at most 3, excluding the main issue.",
    "Never overstate certainty. When unsure, say so in uncertainty_note and set expert_review_recommended to true.",
    "next_steps must be 2-4 practical, low-cost actions a small farmer can do, and should mention checking with a local expert when confidence is low.",
  ].join(" ");

  let response: Response;
  try {
    response = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: `Look closely at this crop photo and diagnose it.\n\n${buildContext(data)}` },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "crop_diagnosis", strict: true, schema },
        },
      }),
    });
  } catch {
    return { ok: false, error: "We could not reach the crop checking service. Please try again." };
  }

  if (response.status === 429) {
    return { ok: false, error: "Too many crop checks right now. Please wait a minute and try again." };
  }
  if (response.status === 402) {
    return { ok: false, error: "The crop checking service has run out of credits. Please add credits and try again." };
  }
  if (!response.ok) {
    console.error("AI diagnosis failed", response.status, await response.text().catch(() => ""));
    return { ok: false, error: "The crop check could not be completed. Please try again in a moment." };
  }

  try {
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) return { ok: false, error: "The crop check returned no answer. Please try again." };
    const parsed = JSON.parse(content) as DiagnosisResult;
    return { ok: true, result: normalize(parsed) };
  } catch (error) {
    console.error("AI diagnosis parse failure", error);
    return { ok: false, error: "We could not read the crop check result. Please try again." };
  }
}

function clamp(value: unknown): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function normalize(raw: DiagnosisResult): DiagnosisResult {
  const alternatives = (Array.isArray(raw.alternatives) ? raw.alternatives : [])
    .slice(0, 3)
    .map((alt) => ({ name: String(alt?.name ?? "Other possible cause"), confidence: clamp(alt?.confidence) }))
    .sort((a, b) => b.confidence - a.confidence);

  return {
    usable_image: raw.usable_image !== false,
    image_quality: raw.image_quality ?? "fair",
    image_note: raw.image_note ?? "",
    crop: raw.crop || "Not clear from the photo",
    issue: raw.issue || "Not clear from the photo",
    confidence: clamp(raw.confidence),
    severity: raw.severity ?? "unknown",
    symptoms: Array.isArray(raw.symptoms) ? raw.symptoms.slice(0, 6).map(String) : [],
    alternatives,
    uncertainty_note: raw.uncertainty_note ?? "",
    expert_review_recommended: Boolean(raw.expert_review_recommended),
    next_steps: Array.isArray(raw.next_steps) ? raw.next_steps.slice(0, 5).map(String) : [],
  };
}