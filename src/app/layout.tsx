import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeCollab - Real-time Code Review",
  description: "Share code, collaborate in real-time, and debug together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased selection:bg-purple-500/30 selection:text-purple-200`}
      >
        {children}
      </body>
    </html>
  );
}
