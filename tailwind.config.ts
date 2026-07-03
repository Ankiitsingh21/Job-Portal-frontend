import type { Config } from "tailwindcss";

// Design direction: this is a trust-first, functional B2B/blue-collar
// hiring product, not a consumer brand — workers apply on cheap Android
// phones, recruiters and admins live in dense tables all day. So the
// palette optimizes for legibility and speed over visual flourish:
// - ink: near-black slate for text/surfaces (not pure black — softer on
//   low-quality phone screens)
// - trust: a deep, unfussy blue used for primary actions & the worker
//   side of the product
// - signal: a warm amber reserved ONLY for things that need attention
//   (pending status, OTP timers, "action required" states)
// - a separate, slightly cooler accent for the recruiter/admin surfaces
//   so a screenshot immediately tells you which portal you're looking at
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B1220",
          900: "#111A2E",
          700: "#334155",
          500: "#64748B",
          200: "#E2E8F0",
          50: "#F8FAFC",
        },
        trust: {
          700: "#1D4ED8",
          600: "#2563EB",
          500: "#3B82F6",
          100: "#DBEAFE",
        },
        signal: {
          600: "#B45309",
          500: "#D97706",
          100: "#FEF3C7",
        },
        admin: {
          700: "#4C1D95",
          600: "#6D28D9",
          100: "#EDE9FE",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        card: "0.625rem",
      },
    },
  },
  plugins: [],
};

export default config;
