import Link from "next/link";

// Pure server component — no interactivity, so no "use client" needed.
// Static-ish marketing content ships as plain HTML with zero JS cost.
export default function GuestLanding() {
  return (
    <section className="grid gap-10 py-8 md:grid-cols-2 md:items-center">
      <div>
        <h1 className="font-display text-3xl font-semibold leading-tight text-ink-900 md:text-4xl">
          Verified daily-wage and contract jobs, near you.
        </h1>
        <p className="mt-4 max-w-md text-ink-700">
          Create a free profile, add your skills and experience, and
          recruiters who are hiring for your trade will find you directly.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/register"
            className="rounded-card bg-trust-600 px-5 py-2.5 font-medium text-white hover:bg-trust-700"
          >
            Create free profile
          </Link>
          <Link
            href="/login"
            className="rounded-card border border-ink-200 px-5 py-2.5 font-medium text-ink-700 hover:bg-ink-50"
          >
            I already have an account
          </Link>
        </div>
      </div>

      <div className="rounded-card border border-ink-200 bg-white p-6">
        <p className="text-sm font-medium uppercase tracking-wide text-ink-500">
          Why sign up first
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink-700">
          <li>· See every open role that matches your skills and location</li>
          <li>· Apply in one tap once your profile is saved</li>
          <li>· Get contacted directly by recruiters who are hiring now</li>
        </ul>
      </div>
    </section>
  );
}
