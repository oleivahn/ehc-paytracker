"use client";

import { useEffect } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function AuthErrorHandler({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    // Listen for storage events to detect token expiry
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key?.includes("clerk") && event.newValue === null) {
        // Token was cleared, likely due to expiry
        console.log("Clerk token cleared, redirecting to sign-in");
        signOut();
        router.push("/sign-in");
      }
    };

    // Listen for errors in the console that might indicate token expiry
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(" ");
      if (
        message.includes("JWT is expired") ||
        message.includes("token-expired")
      ) {
        console.log("JWT expired detected, signing out...");
        signOut();
        router.push("/sign-in");
      }
      originalConsoleError.apply(console, args);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      console.error = originalConsoleError;
    };
  }, [signOut, router]);

  // Show loading while auth is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}
