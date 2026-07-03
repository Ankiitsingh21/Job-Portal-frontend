"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";

interface RegisterResponse {
  userId: string;
  devOtp?: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await apiClient<RegisterResponse>("/auth/worker/register", {
        method: "POST",
        body: JSON.stringify({ email, phone, password }),
      });

      const params = new URLSearchParams({ phone });
      // devOtp only exists outside production (backend gates it on
      // NODE_ENV) — this is the workaround for the SMS/DLT issue: it
      // shows the code directly on screen until SMS delivery is fixed.
      if (result.devOtp) params.set("devOtp", result.devOtp);
      router.push(`/verify-otp?${params.toString()}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink-700">
          Phone number
        </label>
        <input
          type="tel"
          required
          minLength={10}
          maxLength={15}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink-700">
          Password
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-card bg-trust-600 py-2.5 font-medium text-white hover:bg-trust-700 disabled:opacity-50"
      >
        {loading ? "Creating profile…" : "Continue"}
      </button>
    </form>
  );
}
