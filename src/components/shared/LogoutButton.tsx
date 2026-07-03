"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } finally {
      // Full navigation (not router.push) so every Server Component in
      // the tree re-fetches getCurrentUser() with the now-cleared
      // cookie — avoids any stale "logged in" UI lingering in cache.
      window.location.href = "/login";
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-ink-500 hover:text-ink-900 disabled:opacity-50"
    >
      {loading ? "Logging out…" : "Log out"}
    </button>
  );
}
