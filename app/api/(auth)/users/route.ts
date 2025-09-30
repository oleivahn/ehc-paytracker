import { NextResponse } from "next/server";
import connectDB from "@/lib/database-connection";
import User from "@/models/user";
import { capitalizeName } from "@/lib/utils";

export const GET = async () => {
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
        name: capitalizeName(displayName) || `User ${userObj._id}`, // Fallback to User ID if still empty
      };
    });

    return new NextResponse(JSON.stringify(usersWithCapitalizedNames), {
      status: 200,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { message: "Error in fetching users", error: message },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    await connectDB();

    const newUser = new User(body);
    const user = await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "User is created", user: newUser }),
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;

    console.log("There was an error creating a new user:", errorMessage);

    return NextResponse.json(
      { message: "Error creating user", error: errorMessage },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();

    await connectDB();

    const newUser = new User(body);
    const user = await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "User is created", user: newUser }),
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;

    console.log("There was an error creating a new user:", errorMessage);

    return NextResponse.json(
      { message: "Error creating user", error: errorMessage },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const body = await request.json();

    await connectDB();

    const newUser = new User(body);
    const user = await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "User is created", user: newUser }),
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;

    console.log("There was an error creating a new user:", errorMessage);

    return NextResponse.json(
      { message: "Error creating user", error: errorMessage },
      { status: 500 }
    );
  }
};
