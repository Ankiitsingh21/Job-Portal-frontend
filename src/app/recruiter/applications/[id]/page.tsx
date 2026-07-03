import { notFound } from "next/navigation";
import { getApplication } from "@/lib/data/applications";
import ApplicationStatusForm from "@/components/recruiter/ApplicationStatusForm";

export default async function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await getApplication(params.id);
  if (!application) notFound();

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Applicant details
      </h1>

      <div className="mt-4 rounded-card border border-ink-200 bg-white p-5">
        <p className="text-sm text-ink-500">Email</p>
        <p className="text-ink-900">{application.worker?.email ?? "—"}</p>
        <p className="mt-3 text-sm text-ink-500">Phone</p>
        <p className="text-ink-900">{application.worker?.phone ?? "—"}</p>
        {application.coverNote && (
          <>
            <p className="mt-3 text-sm text-ink-500">Cover note</p>
            <p className="whitespace-pre-line text-ink-900">
              {application.coverNote}
            </p>
          </>
        )}
      </div>

      <div className="mt-6">
        <ApplicationStatusForm
          applicationId={application.id}
          currentStatus={application.status}
        />
      </div>
    </div>
  );
}
