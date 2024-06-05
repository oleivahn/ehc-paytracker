"use server";

import { schema } from "@/components/Form/formSchema";
import connectDB from "@/lib/database-connection";
import Shift from "@/models/shift";
import User from "@/models/user";

import { green, red } from "console-log-colors";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

// - What we return
export type FormState = {
  message: string;
  data: object | null | string;
  error?: boolean | null;
};

// - Form Action
export const contactFormAction = async (data: FormData): Promise<FormState> => {
  console.log("📗 LOG [ data ]:", data);
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const formData = Object.fromEntries(data);
  console.log("📗 LOG [ formData ]:", formData);

  const userId = formData.user as string;
  console.log("📗 LOG [ userId ]:", userId);

  // if (!userId || !Types.ObjectId.isValid(userId)) {
  if (!userId) {
    return {
      message: "Invalid form data sent to the server! [No User ID]",
      data: "No User ID",
    };
  }

  const parsed = schema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data sent to the server! [Parse Error]",
      data: "Something didn't parse correctly!",
    };
  }

  try {
    // Do something here
    await connectDB();

    const user = await User.findById(userId);
    console.log("📗 LOG [ user ]:", user);

    if (!user) {
      return {
        message: "User Not Found",
        data: "No User Found",
      };
    }

    const shifts = await Shift.find({ user: new Types.ObjectId(userId) });
    console.log("📗 LOG [ shifts ]:", shifts);

    // const newShift = new Shift(formData);
    const newShift = new Shift({
      name: formData.name as string,
      shiftDate: formData.shiftDate as string,
      location: formData.location as string,
      user: new Types.ObjectId(userId),
      salary: formData.salary as string,
      employeeType: formData.employeeType as string,
      shiftType: formData.shiftType as string,
    });
    await newShift.save();

    revalidatePath("/contactUs");
    console.log(green("Record created successfully"));
    return {
      message: "Form Action Success!",
      data: formData,
    };
  } catch (error: unknown) {
    console.log(red("DB Error: Could not create record:"));
    console.log((error as Error).message);
    return {
      message: (error as Error).message,
      data: formData,
      error: true,
    };
  }
};

export const getUsersAction = async () => {
  try {
    // Do something here
    await connectDB();

    // Get all users and return them
    const users = await User.find();

    revalidatePath("/contactUs");
    console.log(green("Record created successfully"));
    return {
      message: "Got users successfully!",
      data: JSON.parse(JSON.stringify(users)),
    };
  } catch (error: unknown) {
    console.log(red("DB Error: Could not create record:"));
    console.log((error as Error).message);
    return {
      message: (error as Error).message,
      data: {},
      error: true,
    };
  }
};
