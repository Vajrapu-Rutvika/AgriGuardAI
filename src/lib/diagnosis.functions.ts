import { createServerFn } from "@tanstack/react-start";
import type { DiagnosisResponse } from "./diagnosis-types";
import { runCropDiagnosis } from "./diagnosis.server";

export type DiagnosisInput = {
  imageDataUrl: string;
  crop?: string | null;
  growthStage?: string | null;
  village?: string | null;
  knownProblem?: string | null;
};

export const diagnoseCrop = createServerFn({ method: "POST" })
  .inputValidator((data: DiagnosisInput) => {
    if (!data || typeof data.imageDataUrl !== "string" || !data.imageDataUrl.startsWith("data:image/")) {
      throw new Error("A crop image is required.");
    }
    if (data.imageDataUrl.length > 12_000_000) {
      throw new Error("Image is too large. Please use a photo under 8 MB.");
    }
    return data;
  })
  .handler(async ({ data }): Promise<DiagnosisResponse> => runCropDiagnosis(data));