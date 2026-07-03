import Link from "next/link";
import { getRecruiters } from "@/lib/data/admin";

export default async function AdminDashboardPage() {
  const recruiters = await getRecruiters();
  const active = recruiters.filter((r) => r.isActive).length;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Admin dashboard
      </h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-card border border-ink-200 bg-white p-5">
          <p className="text-sm text-ink-500">Active recruiters</p>
          <p className="mt-1 font-display text-3xl font-semibold text-admin-700">
            {active}
          </p>
        </div>
        <div className="rounded-card border border-ink-200 bg-white p-5">
          <p className="text-sm text-ink-500">Total recruiters</p>
          <p className="mt-1 font-display text-3xl font-semibold text-ink-900">
            {recruiters.length}
          </p>
        </div>
      </div>

      <Link
        href="/admin/recruiters/new"
        className="inline-block rounded-card bg-admin-600 px-4 py-2 text-sm font-medium text-white hover:bg-admin-700"
      >
        + Add recruiter
      </Link>
    </div>
  );
}
