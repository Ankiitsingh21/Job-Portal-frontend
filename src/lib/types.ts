// These mirror your Prisma enums/models and controller response shapes
// 1:1 (checked against prisma/schema.prisma and the *.controller.ts /
// *.service.ts files) so every fetch in this app is fully typed end to
// end — no `any`, no guessing field names in JSX.

export type Role = "super_admin" | "recruiter" | "worker";

export type JobStatus = "draft" | "active" | "closed";
export type WageType = "daily" | "monthly";
export type ShiftType = "day" | "night" | "rotational";
export type JobType = "full_time" | "part_time" | "contract";
export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "interview_scheduled"
  | "hired"
  | "rejected";

// Every controller in the backend responds with this envelope
// (see common/middlewares.ts errorHandler + every *.controller.ts).
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: { message: string }[];
}

export interface CurrentUser {
  id: string;
  email: string;
  role: Role;
  phone: string | null;
  phoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  token: string;
  user: CurrentUser;
}

export interface Location {
  id: number;
  state: string;
  city: string;
  locality: string;
}

export interface Industry {
  id: number;
  name: string;
}

export interface Job {
  id: string;
  title: string;
  description?: string | null;
  status: JobStatus;
  jobType: JobType | null;
  shiftType: ShiftType | null;
  wageType: WageType | null;
  wageMin: number | null;
  wageMax: number | null;
  headcountRequired: number;
  headcountFilled: number;
  minExperienceMonths: number;
  industryId: number;
  industry?: Industry;
  locationId: number;
  location?: Location;
  postedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  name: string | null;
  phone: string | null;
}

export interface Recruiter {
  id: string;
  userId: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  categories?: { industryId: number; industry: Industry }[];
}

export interface Application {
  id: string;
  jobId: string;
  workerId: string;
  recruiterId: string;
  status: ApplicationStatus;
  coverNote?: string | null;
  appliedAt: string;
  updatedAt: string;
  // Only present on GET /applications/:id (application.repository.findById
  // includes it) — NOT present on /applications/my or /applications/job/:id,
  // which return bare rows with no relations. See the note in
  // lib/data/worker.ts and the recruiter applications page.
  worker?: { id: string; email: string; phone: string | null };
}
