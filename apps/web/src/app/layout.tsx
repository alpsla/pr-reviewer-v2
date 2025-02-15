import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PR Reviewer",
  description: "Review your pull requests with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}