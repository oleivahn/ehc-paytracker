import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getAuthUserInfo } from "@/lib/authHelper";

// - Sample GET request
export const GET = async () => {
  const { userId, userName, timestamp, timeOfDay } = await getAuthUserInfo();

  logger.request("API TEST GET REQUEST", {
    userId,
    userName,
    timestamp,
    timeOfDay,
  });

  try {
    logger.success("Test API response sent", {
      userId,
      userName,
      timestamp,
      timeOfDay,
    });
    return NextResponse.json({ message: "Hello World!!!" }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Test API GET error", {
      userId,
      userName,
      timestamp,
      timeOfDay,
      error: message,
    });
    return NextResponse.json({ message: message }, { status: 500 });
  }
};

// - Sample POST request
export const POST = async (request: Request, respose: NextResponse) => {
  const { userId, userName, timestamp, timeOfDay } = await getAuthUserInfo();

  try {
    // Info: You have to await the request.json() method to get the body of the request
    const body = await request.json();

    logger.request("API TEST POST REQUEST", {
      userId,
      userName,
      timestamp,
      timeOfDay,
      data: body,
    });

    logger.success("Test API POST response sent", {
      userId,
      userName,
      timestamp,
      timeOfDay,
    });
    return NextResponse.json(body, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Test API POST error", {
      userId,
      userName,
      timestamp,
      timeOfDay,
      error: message,
    });
    return NextResponse.json({ message: message }, { status: 500 });
  }
};
