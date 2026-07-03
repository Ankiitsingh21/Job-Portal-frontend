"use client";

import { useState, FormEvent } from "react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { AuthResult } from "@/lib/types";

export default function OtpForm({ phone }: { phone: string }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Backend sets the session cookie on this response (req.session =
      // { jwt }); since we called it via same-origin /api/*, the
      // browser stores it as a normal first-party cookie.
      await apiClient<AuthResult>("/auth/worker/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone, otp }),
      });
      window.location.href = "/"; // full nav so SSR picks up the new cookie
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    setInfo(null);
    setResending(true);
    try {
      const result = await apiClient<{ devOtp?: string }>(
        "/auth/worker/resend-otp",
        { method: "POST", body: JSON.stringify({ phone }) },
      );
      setInfo(
        result.devOtp
          ? `New code: ${result.devOtp}`
          : "A new code has been sent.",
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend code.");
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={handleVerify} className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink-700">
          6-digit code
        </label>
        <input
          type="text"
          inputMode="numeric"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2 tracking-[0.3em]"
          maxLength={6}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {info && <p className="text-sm text-trust-600">{info}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-card bg-trust-600 py-2.5 font-medium text-white hover:bg-trust-700 disabled:opacity-50"
      >
        {loading ? "Verifying…" : "Verify"}
      </button>

      <button
        type="button"
        onClick={handleResend}
        disabled={resending}
        className="w-full text-sm text-ink-500 hover:text-ink-900 disabled:opacity-50"
      >
        {resending ? "Resending…" : "Resend code"}
      </button>
    </form>
  );
}
