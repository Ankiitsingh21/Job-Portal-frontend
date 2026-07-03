import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { getCurrentUser, homeRouteForRole } from "@/lib/session";

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/recruiter");
  if (user.role !== "recruiter") redirect(homeRouteForRole(user.role));

  return (
    <div className="min-h-screen">
      <Navbar user={user} variant="recruiter" />
      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
        <aside className="w-48 shrink-0 space-y-1 text-sm">
          <a
            href="/recruiter"
            className="block rounded-card px-3 py-2 text-ink-700 hover:bg-admin-100"
          >
            Dashboard
          </a>
          <a
            href="/recruiter/jobs"
            className="block rounded-card px-3 py-2 text-ink-700 hover:bg-admin-100"
          >
            My jobs
          </a>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
