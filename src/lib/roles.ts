import type { Role } from "./types";

export function homeRouteForRole(role: Role): string {
  if (role === "super_admin") return "/admin";
  if (role === "recruiter") return "/recruiter";
  return "/dashboard";
}
