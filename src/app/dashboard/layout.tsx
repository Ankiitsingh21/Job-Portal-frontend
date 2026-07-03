import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { getCurrentUser, homeRouteForRole } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");
  if (user.role !== "worker") redirect(homeRouteForRole(user.role));

  return (
    <div className="min-h-screen">
      <Navbar user={user} variant="worker" />
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
