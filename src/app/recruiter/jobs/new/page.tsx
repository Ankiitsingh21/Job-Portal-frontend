import { getIndustries, getLocations } from "@/lib/data/master";
import JobForm from "@/components/recruiter/JobForm";

export default async function NewJobPage() {
  const [industries, locations] = await Promise.all([
    getIndustries(),
    getLocations(),
  ]);

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Post a job
      </h1>
      <JobForm industries={industries} locations={locations} />
    </div>
  );
}
