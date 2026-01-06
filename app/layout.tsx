import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Formora - Forms that adapt to your intent",
  description: "Build once. Choose how it feels. Create stunning forms with distinct styles that match your context.",
  keywords: ["forms", "form builder", "surveys", "feedback", "onboarding"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
      >
        <StackProvider app={stackClientApp}>
          <StackTheme>
            {children}
            <Toaster position="bottom-right" richColors />
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
