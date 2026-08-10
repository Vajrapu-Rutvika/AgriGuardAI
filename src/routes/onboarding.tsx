import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { FieldWizard } from "@/components/fields/FieldWizard";
import { supabase } from "@/integrations/supabase/client";
import { createField, type FieldInput } from "@/lib/fields";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });
    return { user: data.user };
  },
  head: () => ({
    meta: [
      { title: "Set up your farm | AgriGuard AI" },
      { name: "description", content: "Add your farm, crop and field health in a few simple steps to get guidance made for your field." },
      { property: "og:title", content: "Set up your farm | AgriGuard AI" },
      { property: "og:description", content: "Add your farm, crop and field health to get guidance made for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();

  async function handleSubmit(input: FieldInput) {
    try {
      await createField(user.id, input, true);
      toast.success("Your field is saved 🌾");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save your field. Please try again.");
    }
  }

  return (
    <div className="bg-field min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <SignOutButton className="min-h-11 rounded-2xl" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Let us set up your farm</h1>
          <p className="text-lg text-muted-foreground">
            Four short steps. Every suggestion you get after this is made for your own field.
          </p>
        </div>
        <FieldWizard submitLabel="Save my field" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
