import type { ReactNode } from "react";

export function Tag({ children, tone = "primary" }: { children: ReactNode; tone?: "primary" | "success" | "warning" }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}
