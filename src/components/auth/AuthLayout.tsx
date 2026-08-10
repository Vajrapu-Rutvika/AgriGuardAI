import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Card, CardContent } from "@/components/ui/card";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="bg-field flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <Logo />
      <Card className="w-full max-w-md rounded-3xl shadow-lift">
        <CardContent className="space-y-5 p-6 sm:p-8">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </CardContent>
      </Card>
      {footer ? <div className="text-center text-muted-foreground">{footer}</div> : null}
    </div>
  );
}