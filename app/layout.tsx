import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/theme-provider";

import { ClerkProvider } from "@clerk/nextjs";

import { dark } from "@clerk/themes";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { AuthErrorHandler } from "@/components/auth-error-handler";

export const metadata: Metadata = {
  title: "EHC Paytracker",
  description: "A simple pay tracking app for EHC employees.",
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
  // console.log(
  //   "Theme",
  //   process.env.DEFAULT_THEME ? process.env.DEFAULT_THEME : "light"
  // );

  const theme = process.env.DEFAULT_THEME === "dark" ? dark : undefined;

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme,
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
          suppressHydrationWarning={true}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme={
              process.env.DEFAULT_THEME ? process.env.DEFAULT_THEME : "light"
            }
            enableSystem
            disableTransitionOnChange
          >
            <AuthErrorHandler>
              <div className="relative flex min-h-screen flex-col">
                {/* //*Navbar */}
                <Navbar />

                {/* //*Content */}
                <div className="min-h-screen bg-darker pb-10 dark:bg-background">
                  {children}
                </div>
              </div>
            </AuthErrorHandler>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
