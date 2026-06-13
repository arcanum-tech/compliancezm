import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ComplianceZM — Stay Compliant. Avoid Penalties.",
  description: "ZRA tax reminders, PACRA annual returns, business licence renewals — all in one dashboard for Zambian businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
