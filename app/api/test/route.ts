import { NextResponse } from "next/server";

// - Sample GET request
export const GET = async () => {
  try {
    return NextResponse.json({ message: "Hello World" }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

// - Sample POST request
export const POST = async (request: Request, respose: NextResponse) => {
  try {
    // Info: You have to await the request.json() method to get the body of the request
    const body = await request.json();

    console.log("📗 LOG [ body ]:", body);
    return NextResponse.json(body, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
