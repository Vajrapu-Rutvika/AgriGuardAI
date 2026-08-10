export const LANGUAGES = [
  { value: "te", label: "తెలుగు (Telugu)" },
  { value: "hi", label: "हिंदी (Hindi)" },
  { value: "en", label: "English" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["value"];

export function languageLabel(code: string | null | undefined) {
  return LANGUAGES.find((l) => l.value === code)?.label ?? "English";
}
