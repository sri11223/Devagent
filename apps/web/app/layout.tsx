import "./globals.css";
import type { ReactNode } from "react";
import { Header } from "../shared/components/Header";
import { AuthProvider } from "../shared/providers/AuthProvider";
import { ToastProvider } from "../shared/providers/ToastProvider";

export const metadata = {
  title: "Devagent",
  description: "Multi-agent autonomous software engineering system"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <Header />
            <main className="container">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
