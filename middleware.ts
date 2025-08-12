import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/new_day(.*)",
  "/new_employee(.*)",
  "/dashboard(.*)",
  "/",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    try {
      auth().protect();
    } catch (error) {
      // Handle token expiry gracefully
      console.log("Auth error:", error);
      // This will redirect to sign-in if token is expired
      auth().protect();
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
