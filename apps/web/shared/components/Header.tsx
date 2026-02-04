"use client";

import Link from "next/link";
import { NAV_LINKS } from "../constants/navigation";
import { Button } from "./Button";
import { useAuth } from "../providers/AuthProvider";

export function Header() {
  const { user, signOut, status } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <Link className="logo" href="/">
          Devagent
        </Link>
        <nav className="nav">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {status === "authenticated" && user ? (
            <>
              <span className="user-pill">{user.name}</span>
              <Button variant="ghost" onClick={signOut}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
