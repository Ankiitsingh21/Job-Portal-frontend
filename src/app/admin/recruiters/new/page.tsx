import { getIndustries } from "@/lib/data/master";
import RecruiterForm from "@/components/admin/RecruiterForm";

export default async function NewRecruiterPage() {
  // Industries are fetched server-side and passed down as a prop —
  // the form component itself does zero data-fetching of its own for
  // its dropdown options, only for the final submit.
  const industries = await getIndustries();

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Add recruiter
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        This creates their login and assigns which job categories they can
        post and search within.
      </p>
      <RecruiterForm industries={industries} />
    </div>
  );
}
