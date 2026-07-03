import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import JobList from "@/components/worker/JobList";
import GuestLanding from "@/components/worker/GuestLanding";
import { getCurrentUser, homeRouteForRole } from "@/lib/session";
import { getJobs } from "@/lib/data/jobs";

// Server Component — runs on every request (no static caching, since
// job availability changes constantly). This is the SSR half: by the
// time HTML reaches the browser, a logged-in worker already has their
// job list rendered — no client-side loading spinner on first paint.
export default async function HomePage() {
  const user = await getCurrentUser();

  // A recruiter/admin landing on the root domain gets sent to their
  // own portal instead of seeing the worker signup flow.
  if (user && user.role !== "worker") {
    redirect(homeRouteForRole(user.role));
  }

  // GET /api/jobs requires auth on the backend today, so a guest gets
  // no data here — see the flag about adding a public listing route.
  const jobs = user ? await getJobs() : [];

  return (
    <div className="min-h-screen">
      <Navbar user={user} variant="worker" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {user ? (
          // Initial SSR data is handed to JobList as a prop, which then
          // takes over client-side for search/filter interactivity —
          // this is the CSR layer sitting on top of the SSR payload.
          <JobList initialJobs={jobs} />
        ) : (
          <GuestLanding />
        )}
      </main>
    </div>
  );
}
