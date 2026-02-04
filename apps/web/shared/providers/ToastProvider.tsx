"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useToast } from "../hooks/useToast";

const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-stack">
        {toast.toasts.map((item) => (
          <div key={item.id} className={`toast toast-${item.tone ?? "neutral"}`}>
            <div>
              <strong>{item.title}</strong>
              {item.description && <p>{item.description}</p>}
            </div>
            <button type="button" onClick={() => toast.dismiss(item.id)} aria-label="Dismiss">
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within ToastProvider");
  }
  return context;
}
