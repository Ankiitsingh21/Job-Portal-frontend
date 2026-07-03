import Navbar from "@/components/shared/Navbar";
import LoginForm from "@/components/worker/LoginForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <div className="min-h-screen">
      <Navbar user={null} variant="worker" />
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Log in
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Workers, recruiters, and admins all log in here — you'll land on
          the right screen automatically.
        </p>
        <LoginForm nextPath={searchParams.next} />
      </main>
    </div>
  );
}
