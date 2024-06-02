"use server";

import { schema } from "@/components/Form/formSchema";
import connectDB from "@/lib/database-connection";
import Shift from "@/models/shift";

import { green, red } from "console-log-colors";
import { revalidatePath } from "next/cache";

// - What we return
export type FormState = {
  message: string;
  data: object | null | string;
  error?: boolean | null;
};

// - Form Action
export const getDataAction = async (formData: FormData): Promise<FormState>=> {
  try {
    // - Do something here
    await connectDB();
    const shifts = await Shift.find();
    revalidatePath("/dashboard");
    console.log(green("Record created successfully"));

    return {
      message: "Form Action Success!",
      // data: shifts,
      data: JSON.parse(JSON.stringify(shifts)),
      // error: true,
    };;
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
