"use server";

import { schema } from "@/app/new_employee/userFormSchema";
import connectDB from "@/lib/database-connection";
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
    // Connect to the database and save the new user
    await connectDB();
    const newUser = new User(formData);
    await newUser.save();

    revalidatePath("/new_employee");
    console.log(green("User created successfully"));
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
