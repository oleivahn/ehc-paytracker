"use server";

import { schema } from "@/app/new_employee/userFormSchema";
import connectDB from "@/lib/database-connection";
import User from "@/models/user";
import { auth, currentUser } from "@clerk/nextjs/server";

import { green, red, yellow } from "console-log-colors";
import { revalidatePath } from "next/cache";

// - What we return
export type FormState = {
  message: string;
  data: object | null | string;
  error?: boolean | null;
};

// - Form Action
export const contactFormAction = async (data: FormData): Promise<FormState> => {
  // Get authenticated user info
  const { userId } = await auth();
  const user = await currentUser();
  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.emailAddresses?.[0]?.emailAddress || "Unknown";

  // Format timestamp as mm-dd-yy
  const now = new Date();
  const timestamp = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}-${String(now.getFullYear()).slice(-2)}`;
  const timeOfDay = now.toLocaleTimeString();

  // Enhanced logging
  console.log("═".repeat(80));
  console.log(`📝 NEW EMPLOYEE REQUEST`);
  console.log(`👤 User ID: ${userId || "Unknown"}`);
  console.log(`👤 User Name: ${userName}`);
  console.log(`📅 Date: ${timestamp}`);
  console.log(`🕐 Time: ${timeOfDay}`);
  console.log("═".repeat(80));

  const formData = Object.fromEntries(data);
  console.log("📗 LOG [ Creating new user with formData ]:", formData);

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

    // Create the name field by combining firstName and lastName and convert text fields to lowercase
    const userDataWithName = {
      ...formData,
      firstName: formData.firstName.toString().toLowerCase(),
      lastName: formData.lastName.toString().toLowerCase(),
      email: formData.email.toString().toLowerCase(),
      name: `${formData.firstName.toString().toLowerCase()} ${formData.lastName
        .toString()
        .toLowerCase()}`,
      active: true, // Default to active for new employees
    };

    const newUser = new User(userDataWithName);
    await newUser.save();

    revalidatePath("/new_employee");
    console.log(
      `✅ User created successfully with name: ${userDataWithName.name}`,
    );
    console.log(`   By: ${userName} (${userId || "Unknown"}) at ${timestamp} ${timeOfDay}`);
    console.log("═".repeat(80));
    return {
      message: "Form Action Success!",
      data: userDataWithName,
    };
  } catch (error: unknown) {
    console.log("❌ DB Error: Could not create record:");
    console.log(`   By: ${userName} (${userId || "Unknown"}) at ${timestamp} ${timeOfDay}`);
    console.log((error as Error).message);
    console.log("═".repeat(80));
    return {
      message: (error as Error).message,
      data: formData,
      error: true,
    };
  }
};
