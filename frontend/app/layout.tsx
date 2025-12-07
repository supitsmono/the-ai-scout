import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Scout",
  description: "Model scouting dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}

