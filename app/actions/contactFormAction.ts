"use server";

import { schema } from "@/components/Form/formSchema";

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
  // const name = formData.get("name");
  // const location = formData.get("location");
  // console.log(green(`NAME: ${name}`));
  // console.log(green(`LOCATION: ${location}`));

  console.log("We are in the server!!");

  const formData = Object.fromEntries(data);
  const parsed = schema.safeParse(formData);

  console.log("📗 LOG [ formData ]:", formData);
  console.log("📗 LOG [ parsed ]:", parsed);

  if (!parsed.success) {
    return {
      message: "Invalid form data on the server!",
    };
  }

  // if (parsed.data.email.includes("a")) {
  //   return {
  //     message: "Invalid email on the server!",
  //   };
  // }

  try {
    // - Do something here

    revalidatePath("/contactUs");
    return {
      message: "Form Action Success!",
    };
  } catch (error: unknown) {
    return { message: (error as Error).message };
  }
};
