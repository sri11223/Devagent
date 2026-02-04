import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "../utils/clsx";

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost"; children: ReactNode }) {
  return (
    <button className={clsx("button", variant, className)} {...props}>
      {children}
    </button>
  );
}
