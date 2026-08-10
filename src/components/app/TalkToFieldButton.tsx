import { Link } from "@tanstack/react-router";
import { Mic } from "lucide-react";

/** Persistent voice entry point available on every app screen. */
export function TalkToFieldButton() {
  return (
    <Link
      to="/chat"
      aria-label="Talk to my field"
      className="bg-leaf-gradient fixed bottom-24 right-4 z-40 flex min-h-14 items-center gap-2 rounded-full px-5 py-4 text-base font-semibold text-primary-foreground shadow-lift transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:bottom-8 md:right-8"
    >
      <Mic className="size-6" aria-hidden />
      <span className="hidden sm:inline">Talk to My Field</span>
    </Link>
  );
}