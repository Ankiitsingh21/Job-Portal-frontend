import Link from "next/link";
import { getOwnProfile } from "@/lib/data/worker";
import { getMyApplications } from "@/lib/data/applications-mine";

const STATUS_COLOR: Record<string, string> = {
  applied: "bg-ink-100 text-ink-700",
  shortlisted: "bg-trust-100 text-trust-700",
  interview_scheduled: "bg-signal-100 text-signal-600",
  hired: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default async function WorkerDashboardPage() {
  const [profile, applications] = await Promise.all([
    getOwnProfile(),
    getMyApplications(),
  ]);

  return (
    <div className="space-y-8">
      <section className="rounded-card border border-ink-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-900">
            Your profile
          </h2>
          <Link href="/dashboard/profile" className="text-sm text-trust-600">
            {profile ? "Edit" : "Complete your profile"}
          </Link>
        </div>
        {profile ? (
          <p className="mt-2 text-sm text-ink-700">
            {profile.name ?? "No name set"} · {profile.phone ?? "No phone set"}
          </p>
        ) : (
          <p className="mt-2 text-sm text-ink-500">
            You haven't built a profile yet — recruiters can't find you
            until you do.
          </p>
        )}
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-ink-900">
          Your applications
        </h2>
        {applications.length === 0 ? (
          <p className="mt-2 text-sm text-ink-500">
            No applications yet.{" "}
            <Link href="/" className="text-trust-600">
              Browse open jobs
            </Link>
            .
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between rounded-card border border-ink-200 bg-white px-4 py-3"
              >
                <span className="text-sm text-ink-900">
                  {app.jobTitle}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    STATUS_COLOR[app.status] ?? "bg-ink-100 text-ink-700"
                  }`}
                >
                  {app.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
