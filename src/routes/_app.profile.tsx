import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Language | AgriGuard AI" },
      { name: "description", content: "Set your language, village and account details for AgriGuard AI." },
      { property: "og:title", content: "Profile & Language | AgriGuard AI" },
      { property: "og:description", content: "Set your language, village and account details." },
    ],
  }),
  component: ProfilePage,
});

const languages = ["తెలుగు (Telugu)", "हिंदी (Hindi)", "English"];

function ProfilePage() {
  return (
    <>
      <PageHeader emoji="👤" title="Profile" description="Your language, your village and your account." />
      <Card className="rounded-3xl shadow-soft">
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label className="text-base">Preferred language</Label>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <Button key={lang} variant="outline" size="lg" className="rounded-2xl" disabled>
                  {lang}
                </Button>
              ))}
            </div>
            <p className="text-muted-foreground">Language switching will be enabled with your account.</p>
          </div>
          <div className="border-t border-border pt-4">
            <Button asChild variant="outline" size="lg" className="rounded-2xl">
              <Link to="/login">Sign in to save your details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}