import Link from "next/link";
import { getRecruiters } from "@/lib/data/admin";
import RecruiterRowActions from "@/components/admin/RecruiterRowActions";

export default async function RecruitersListPage() {
  const recruiters = await getRecruiters();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Recruiters
        </h1>
        <Link
          href="/admin/recruiters/new"
          className="rounded-card bg-admin-600 px-4 py-2 text-sm font-medium text-white hover:bg-admin-700"
        >
          + Add recruiter
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-card border border-ink-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-ink-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Categories</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {recruiters.map((r) => (
              <tr key={r.id} className="border-t border-ink-200">
                <td className="px-4 py-3 text-ink-900">{r.name}</td>
                <td className="px-4 py-3 text-ink-700">{r.email}</td>
                <td className="px-4 py-3 text-ink-700">
                  {r.categories?.map((c) => c.industry.name).join(", ") || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      r.isActive
                        ? "bg-trust-100 text-trust-700"
                        : "bg-ink-100 text-ink-500"
                    }`}
                  >
                    {r.isActive ? "Active" : "Deactivated"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <RecruiterRowActions recruiterId={r.id} isActive={r.isActive} />
                </td>
              </tr>
            ))}
            {recruiters.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-500">
                  No recruiters yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
