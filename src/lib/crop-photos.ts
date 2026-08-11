import { supabase } from "@/integrations/supabase/client";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Please choose a photo file (JPG, PNG or WEBP).";
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return "This photo type is not supported. Please use JPG, PNG or WEBP.";
  if (file.size > MAX_IMAGE_BYTES) return "This photo is larger than 8 MB. Please use a smaller photo.";
  if (file.size < 5 * 1024) return "This photo looks too small to read. Please take a clearer photo.";
  return null;
}

/** Downscale for upload/AI and check the picture is large enough to be readable. */
export async function prepareImage(file: File): Promise<{ dataUrl: string; warning: string | null }> {
  const original = await readAsDataUrl(file);
  const img = await loadImage(original);

  const warning =
    img.naturalWidth < 400 || img.naturalHeight < 400
      ? "This photo is small. A closer, larger photo gives a better answer."
      : null;

  const maxSide = 1280;
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  if (scale === 1 && original.length < 1_500_000) return { dataUrl: original, warning };

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return { dataUrl: original, warning };
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return { dataUrl: canvas.toDataURL("image/jpeg", 0.85), warning };
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("We could not read this photo."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This file is not a readable photo."));
    img.src = src;
  });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [head, body] = dataUrl.split(",");
  const mime = head?.match(/data:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(body ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function uploadCropPhoto(userId: string, dataUrl: string): Promise<string> {
  const blob = dataUrlToBlob(dataUrl);
  const path = `${userId}/${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from("crop-photos").upload(path, blob, {
    contentType: blob.type,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function getCropPhotoUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from("crop-photos").createSignedUrl(path, 60 * 60);
  if (error) return null;
  return data.signedUrl;
}