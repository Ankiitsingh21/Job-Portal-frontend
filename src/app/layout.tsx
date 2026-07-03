import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";

// Lexend for headings: designed for reading-fluency research, sits
// well against a functional/utility brand without looking like every
// other startup's Inter-on-Inter page. Inter for body/UI text — the
// safest, most legible choice for dense tables and forms.
const display = Lexend({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "SCN Jobs",
  description: "Find verified daily-wage and contract jobs near you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
