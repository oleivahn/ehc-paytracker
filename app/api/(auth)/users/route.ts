import { NextResponse } from "next/server";
import connectDB from "@/lib/database-connection";
import User from "@/models/user";
import { capitalizeWords } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { getAuthUserInfo } from "@/lib/authHelper";

export const GET = async () => {
  const { userId, userName, timestamp, timeOfDay } = await getAuthUserInfo();

  logger.request("API GET USERS REQUEST", {
    userId,
    userName,
    timestamp,
    timeOfDay,
  });

  try {
    // - Connect to the database
    await connectDB();

    const users = await User.find();

    // Capitalize the name field for each user, fallback to firstName + lastName if name is empty
    const usersWithCapitalizedNames = users.map((user) => {
      const userObj = user.toObject();
      let displayName = userObj.name;

      // If name is empty or doesn't exist, create it from firstName and lastName
      if (!displayName || displayName.trim() === "") {
        displayName = `${userObj.firstName || ""} ${
          userObj.lastName || ""
        }`.trim();
      }

      return {
        ...userObj,
        name: capitalizeWords(displayName) || `User ${userObj._id}`, // Fallback to User ID if still empty
      };
    });

    logger.success(
      `Users fetched successfully (${usersWithCapitalizedNames.length} users)`,
      {
        userId,
        userName,
        timestamp,
        timeOfDay,
      },
    );

    return new NextResponse(JSON.stringify(usersWithCapitalizedNames), {
      status: 200,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Error fetching users", {
      userId,
      userName,
      timestamp,
      timeOfDay,
      error: message,
    });
    return NextResponse.json(
      { message: "Error in fetching users", error: message },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request) => {
  const { userId, userName, timestamp, timeOfDay } = await getAuthUserInfo();

  try {
    const body = await request.json();

    logger.request("API CREATE USER REQUEST", {
      userId,
      userName,
      timestamp,
      timeOfDay,
      data: body,
    });

    await connectDB();

    const newUser = new User(body);
    const user = await newUser.save();

    logger.success("User created successfully", {
      userId,
      userName,
      timestamp,
      timeOfDay,
    });

    return new NextResponse(
      JSON.stringify({ message: "User is created", user: newUser }),
      { status: 201 },
    );
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    logger.error("Error creating user", {
      userId,
      userName,
      timestamp,
      timeOfDay,
      error: errorMessage,
    });
    return NextResponse.json(
      { message: "Error creating user", error: errorMessage },
      { status: 500 },
    );
  }
};

export const PATCH = async (request: Request) => {
  const { userId, userName, timestamp, timeOfDay } = await getAuthUserInfo();

  try {
    const body = await request.json();

    logger.request("API PATCH USER REQUEST", {
      userId,
      userName,
      timestamp,
      timeOfDay,
      data: body,
    });

    await connectDB();

    const newUser = new User(body);
    const user = await newUser.save();

    logger.success("User patched successfully", {
      userId,
      userName,
      timestamp,
      timeOfDay,
    });

    return new NextResponse(
      JSON.stringify({ message: "User is created", user: newUser }),
      { status: 201 },
    );
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    logger.error("Error patching user", {
      userId,
      userName,
      timestamp,
      timeOfDay,
      error: errorMessage,
    });
    return NextResponse.json(
      { message: "Error creating user", error: errorMessage },
      { status: 500 },
    );
  }
};

export const DELETE = async (request: Request) => {
  const { userId, userName, timestamp, timeOfDay } = await getAuthUserInfo();

  try {
    const body = await request.json();

    logger.request("API DELETE USER REQUEST", {
      userId,
      userName,
      timestamp,
      timeOfDay,
      data: body,
    });

    await connectDB();

    const newUser = new User(body);
    const user = await newUser.save();

    logger.success("User deleted successfully", {
      userId,
      userName,
      timestamp,
      timeOfDay,
    });

    return new NextResponse(
      JSON.stringify({ message: "User is created", user: newUser }),
      { status: 201 },
    );
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    logger.error("Error deleting user", {
      userId,
      userName,
      timestamp,
      timeOfDay,
      error: errorMessage,
    });
    return NextResponse.json(
      { message: "Error creating user", error: errorMessage },
      { status: 500 },
    );
  }
};
