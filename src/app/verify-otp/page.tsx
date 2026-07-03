import Navbar from "@/components/shared/Navbar";
import OtpForm from "@/components/worker/OtpForm";

export default function VerifyOtpPage({
  searchParams,
}: {
  searchParams: { phone?: string; devOtp?: string };
}) {
  return (
    <div className="min-h-screen">
      <Navbar user={null} variant="worker" />
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Verify your phone
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Enter the 6-digit code sent to {searchParams.phone ?? "your phone"}.
        </p>

        {searchParams.devOtp && (
          <div className="mt-4 rounded-card border border-signal-500 bg-signal-100 px-3 py-2 text-sm text-signal-600">
            SMS delivery is temporarily unavailable — your code is{" "}
            <strong>{searchParams.devOtp}</strong>.
          </div>
        )}

        <OtpForm phone={searchParams.phone ?? ""} />
      </main>
    </div>
  );
}
