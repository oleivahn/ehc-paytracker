"use server";

import { schema } from "@/components/Form/formSchema";
import connectDB from "@/lib/database-connection";
import Shift from "@/models/shift";
import User from "@/models/user";

import { green, red } from "console-log-colors";
import { revalidatePath } from "next/cache";

// - What we return
export type FormState = {
  message: string;
  data: object | null | string;
  error?: boolean | null;
};

// - Form Action
export const contactFormAction = async (data: FormData): Promise<FormState> => {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const formData = Object.fromEntries(data);
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

    const newShift = new Shift(formData);
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
