import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic } from "lucide-react";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({
    meta: [
      { title: "Talk to My Field | AgriGuard AI" },
      { name: "description", content: "Ask about your crop by voice in Telugu, Hindi or English." },
      { property: "og:title", content: "Talk to My Field | AgriGuard AI" },
      { property: "og:description", content: "Ask about your crop by voice in your own language." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <>
      <PageHeader
        emoji="🎙️"
        title="Talk to My Field"
        description="Speak in Telugu, Hindi or English. Ask anything about your crop, weather or spraying."
      />
      <Card className="rounded-3xl shadow-soft">
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <span className="bg-leaf-gradient flex size-20 items-center justify-center rounded-full text-primary-foreground shadow-lift">
            <Mic className="size-9" aria-hidden />
          </span>
          <h2 className="text-lg font-semibold">Voice answers are being prepared</h2>
          <p className="max-w-lg text-muted-foreground">
            The microphone will start working here once the voice assistant is connected. Until then, no answers are
            shown so you are never guided by guesswork.
          </p>
          <Button size="lg" className="rounded-2xl" disabled>
            Hold to speak
          </Button>
        </CardContent>
      </Card>
    </>
  );
}