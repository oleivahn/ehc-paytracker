import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "EHC Delivery",
  description: "Service you can trust",
  icons: {
    icon: ["/favicon.ico?=4"],
    apple: ["/apple-touch-icon.png?=4"],
    shortcut: ["/apple-touch-icon.png?=4"],
  },
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  console.log("Theme", process.env.DEFAULT_THEME);
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme={
            process.env.DEFAULT_THEME ? process.env.DEFAULT_THEME : "light"
          }
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <div className="min-h-screen bg-darker pb-10 dark:bg-background">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
