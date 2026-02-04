import type { InputHTMLAttributes } from "react";

export function TextInput({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <div className="input">
      <label htmlFor={props.id}>{label}</label>
      <input {...props} />
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}
