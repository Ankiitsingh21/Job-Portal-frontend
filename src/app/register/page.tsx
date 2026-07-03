import Navbar from "@/components/shared/Navbar";
import RegisterForm from "@/components/worker/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <Navbar user={null} variant="worker" />
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Create your worker profile
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Free, takes under a minute. We'll text you a code to verify your
          number.
        </p>
        <RegisterForm />
      </main>
    </div>
  );
}
