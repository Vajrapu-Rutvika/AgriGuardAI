import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { listFields, type Field } from "@/lib/fields";

/** The farmer's fields plus whichever one is currently marked active. */
export function useActiveField() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["fields", user?.id],
    queryFn: () => listFields(user!.id),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  });

  const fields: Field[] = query.data ?? [];
  const activeField = fields.find((f) => f.is_active) ?? fields[0] ?? null;

  return { ...query, fields, activeField, userId: user?.id ?? null };
}