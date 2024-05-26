"use server";

import { schema } from "@/components/Form/formSchema";
import connectDB from "@/lib/database-connection";
import User from "@/models/user";


import { green } from "console-log-colors";
import { revalidatePath } from "next/cache";

// - What we are returning
export type FormState = {
  message: string;
};

export const contactFormAction = async (
  // prevState: FormState,
  data: FormData
): Promise<FormState> => {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("We are in the server!!");

  const formData = Object.fromEntries(data);
  const parsed = schema.safeParse(formData);

  console.log("📗 LOG [ formData ]:", formData);
  console.log("📗 LOG [ parsed ]:", parsed);

  if (!parsed.success) {
    return {
      message: "Invalid form data sent to the server!",
    };
  }


  try {
    // - Do something here
    await connectDB();

    const TEST_DATA = {
      email: "action@dj.com",
      username: "Action User",
      password: "Action124",
    };

    const newUser = new User(TEST_DATA);
    // const newUser = new User(body);
    const user = await newUser.save();

    revalidatePath("/contactUs");
    return {
      message: "Form Action Success!",
    };
  } catch (error: unknown) {
    return { message: (error as Error).message };
  }
};