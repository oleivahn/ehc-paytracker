import { NextResponse } from "next/server";
import connectDB from "@/lib/database-connection";
import User from "@/models/user";

export const GET = async () => {
  try {
    // - Connect to the database
    await connectDB();

    const users = await User.find();

    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in fetching users", error: error.message },
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
  } catch (error) {
    console.log("There was an error creating a new user:", error.message);
    return NextResponse.json(
      { message: "Error creating user", error: error.message },
      { status: 500 }
    );
  }
};
