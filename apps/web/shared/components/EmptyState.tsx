import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "./Button";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: { label: string; onClick?: () => void; href?: string; helper?: ReactNode };
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <div className="empty-action">
          {action.href ? (
            <Link href={action.href}>
              <Button>{action.label}</Button>
            </Link>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
          {action.helper}
        </div>
      )}
    </div>
  );
}
