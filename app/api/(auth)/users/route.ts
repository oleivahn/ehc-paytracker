import { NextResponse } from "next/server";
import connectDB from "@/lib/database-connection";
import User from "@/models/user";

export const GET = async () => {
  // return NextResponse.json({ message: "Hello World!!!" }, { status: 200 });
  try {
    // - Connect to the database
    await connectDB();

    const users = await User.find();

    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { message: "Error in fetching users", error: message },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  return NextResponse.json({ message: "Hello World!!!" }, { status: 200 });
  // try {
  //   const body = await request.json();

  //   await connectDB();

  //   const newUser = new User(body);
  //   const user = await newUser.save();

  //   return new NextResponse(
  //     JSON.stringify({ message: "User is created", user: newUser }),
  //     { status: 201 }
  //   );
  // } catch (error: unknown) {
  //   const message = error instanceof Error ? error.message : "Unknown error";

  //   console.log("There was an error creating a new user:", error.message);
  //   return NextResponse.json(
  //     { message: "Error creating user", error: message },
  //     { status: 500 }
  //   );
  // }
};
