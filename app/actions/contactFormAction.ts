"use server";

import { green } from "console-log-colors";
import { revalidatePath } from "next/cache";

export const contactFormAction = async (formData: any) => {
  const name = formData.get("name");
  const email = formData.get("email");

  console.log("We are in the server!!");
  console.log(green(`NAME: ${name}`));
  console.log(green(`EMAIL: ${email}`));

  try {
    // - Do something here

    revalidatePath("/contactUs");

    return "Form Action Success!";
  } catch (error: unknown) {
    return { Error: (error as Error).message };
  }
};
