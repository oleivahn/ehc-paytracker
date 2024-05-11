import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "EHC Delivery",
  description: "Service you can trust",
  // icons: [  
  //   {
  //     rel: "icon",
  //     href: "/favicon.ico",
  //     url: "/favicon.ico", // Add the 'url' property with the same value as 'href'
  //   },
  //   {
  //     rel: "apple-touch-icon",
  //     href: "/apple-touch-icon.png",
  //     sizes: "180x180",
  //     url: "/apple-touch-icon.png", // Add the 'url' property with the same value as 'href'
  //   },
  //   {
  //     rel: "manifest",
  //     href: "/site.webmanifest",
  //     url: "/site.webmanifest", // Add the 'url' property with the same value as 'href'
  //   },
  // ],
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <div className="h-screen bg-app dark:bg-background">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
