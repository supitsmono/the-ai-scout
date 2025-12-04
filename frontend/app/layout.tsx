import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "The AI Scout",
  description: "AI-powered scouting platform for modeling agencies",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-neutral-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
