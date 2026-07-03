/**
 * We proxy every browser-side call to /api/* straight through to the
 * Express backend. This means the browser only ever talks to
 * scnjobs.com (same origin) — no CORS setup needed on the backend,
 * and the cookie-session cookie behaves like a normal first-party
 * cookie instead of a cross-site one (which iOS Safari/Brave often
 * block by default).
 *
 * Server Components / Server Actions skip this proxy and call
 * BACKEND_URL directly (see src/lib/api-server.ts) — faster, one
 * less hop, and they forward the incoming request's cookies manually.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backend = process.env.BACKEND_URL || "http://localhost:3000";
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
