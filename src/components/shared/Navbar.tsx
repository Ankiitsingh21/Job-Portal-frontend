import Link from "next/link";
import type { CurrentUser } from "@/lib/types";
import LogoutButton from "./LogoutButton";

interface NavbarProps {
  user: CurrentUser | null;
  /** Which portal chrome to render — controls the accent color and the home link. */
  variant?: "worker" | "recruiter" | "admin";
}

const HOME_BY_VARIANT: Record<NonNullable<NavbarProps["variant"]>, string> = {
  worker: "/",
  recruiter: "/recruiter",
  admin: "/admin",
};

const ACCENT_BY_VARIANT: Record<NonNullable<NavbarProps["variant"]>, string> = {
  worker: "text-trust-600",
  recruiter: "text-admin-600",
  admin: "text-admin-700",
};

export default function Navbar({ user, variant = "worker" }: NavbarProps) {
  return (
    <header className="border-b border-ink-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href={HOME_BY_VARIANT[variant]}
          className={`font-display text-lg font-semibold ${ACCENT_BY_VARIANT[variant]}`}
        >
          SCN Jobs
          {variant !== "worker" && (
            <span className="ml-2 rounded bg-ink-100 px-2 py-0.5 text-xs font-normal uppercase tracking-wide text-ink-500">
              {variant}
            </span>
          )}
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="text-ink-500">{user.email}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-ink-700 hover:text-trust-600">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-card bg-trust-600 px-3 py-1.5 text-white hover:bg-trust-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
