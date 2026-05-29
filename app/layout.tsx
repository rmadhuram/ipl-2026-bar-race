import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IPL 2026 Points Race",
  description: "Bar chart race of IPL 2026 team standings",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
