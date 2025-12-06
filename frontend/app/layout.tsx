import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The AI Scout – The Operating System for Modern Model Scouting",
  description: "The Operating System for Modern Model Scouting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`
          ${inter.className}
          bg-[#050816] text-white antialiased 
          min-h-screen w-full overflow-x-hidden
        `}
      >
        <div id="app-root" className="w-full min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
