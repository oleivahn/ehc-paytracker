import { auth, currentUser } from "@clerk/nextjs/server";

export type RequestContext = {
  userId: string | null;
  userName: string;
  timestamp: string;
  timeOfDay: string;
};

/**
 * Get the current authenticated user info and timestamp for request logging
 * @returns RequestContext with userId, userName, timestamp (mm-dd-yy), and timeOfDay
 */
export const getAuthUserInfo = async (): Promise<RequestContext> => {
  // Get authenticated user info
  const { userId } = await auth();
  const user = await currentUser();
  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.emailAddresses?.[0]?.emailAddress || "Unknown";

  // Format timestamp as mm-dd-yy
  const now = new Date();
  const timestamp = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}-${String(now.getFullYear()).slice(-2)}`;
  const timeOfDay = now.toLocaleTimeString();

  return {
    userId,
    userName,
    timestamp,
    timeOfDay,
  };
};
