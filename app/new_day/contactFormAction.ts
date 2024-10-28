"use server";

import { schema } from "@/app/new_day/formSchema";
import connectDB from "@/lib/database-connection";
import Shift from "@/models/shift";
import User from "@/models/user";

import { green, red } from "console-log-colors";
import mongoose, { Types } from "mongoose";
import { revalidatePath } from "next/cache";

// - What we return
export type FormState = {
  message: string;
  data: object | null | string;
  error?: boolean | null;
};

// - Add a new shift to MongoDB
export const contactFormAction = async (data: FormData): Promise<FormState> => {
  console.log("📗 LOG on FormAction [ data ]:", data);
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  // Convert FormData to a regular object
  const formData: { [key: string]: any } = {};
  data.forEach((value, key) => (formData[key] = value));

  formData.outOfState = formData.outOfState === "true" ? true : false;
  console.log("📗 LOG [ formData2 ]:", formData);

  // ! DO NOT USE Object.fromEntries(data) as it will not work with FormData, can't update the object
  // const formData = Object.fromEntries(data);
  // console.log("Object?", typeof formData);
  // console.log("📗 LOG on FormAction [ formData ]:", formData);

  const userId = formData.user as string;
  console.log("📗 LOG on FormAction [ userId ]:", userId);

  // if (!userId || !Types.ObjectId.isValid(userId)) {
  if (!userId) {
    return {
      message: "Invalid form data sent to the server! [No User ID]",
      data: "No User ID",
    };
  }

  // Parse the form data on the server to avoid any client side manipulation
  const parsed = schema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data sent to the server! [Parse Error]",
      data: "Something didn't parse correctly!",
    };
  }

  try {
    await connectDB();

    // Check if shift exists
    const shiftExists = await Shift.exists({
      name: formData.name as string,
      shiftDate: formData.shiftDate as string,
    });
    console.log("🔥 [ shiftExists ]:", shiftExists);

    if (shiftExists) {
      return {
        message: "Shift Already Exists",
        data: shiftExists,
      };
    }

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
      easyDate: formData.easyDate as string,
      location: formData.location as string,
      user: new Types.ObjectId(userId),
      salary: formData.salary as string,
      employeeType: formData.employeeType as string,
      shiftType: formData.shiftType as string,
      outOfState: formData.outOfState as boolean,
    });

    await newShift.save();
    revalidatePath("/NewDay");

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

// - Update a shift in MongoDB
export const updateShiftAction = async (data: FormData) => {
  console.log("📗 LOG [ data tp update ]:", data);
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  // Convert FormData to a regular object
  const formData: { [key: string]: any } = {};
  data.forEach((value, key) => (formData[key] = value));

  formData.outOfState = formData.outOfState === "true" ? true : false;

  // Check if shift exists
  const shiftExists = await Shift.exists({
    name: formData.name as string,
    shiftDate: formData.shiftDate as string,
  });
  console.log("📗 LOG [ shiftExists on update ]:", shiftExists);

  if (!shiftExists) {
    return {
      message: "Invalid form data sent to the server! [Shift doesnt exist]",
      data: "No Shift",
    };
  }

  const parsed = schema.safeParse(formData);
  console.log("📗 LOG [ parsed ]:", parsed);

  if (!parsed.success) {
    return {
      message: "Invalid form data sent to the server! [Parse Error]",
      data: "Something didn't parse correctly!",
    };
  }

  const userId = formData.user as string;

  try {
    await connectDB();

    const updatedShift = await Shift.findOneAndUpdate(
      {
        name: formData.name as string,
        shiftDate: formData.shiftDate as string,
      },
      {
        name: formData.name as string,
        shiftDate: formData.shiftDate as string,
        easyDate: formData.easyDate as string,
        location: formData.location as string,
        // user: new mongoose.Types.ObjectId(userId),
        salary: formData.salary as string,
        employeeType: formData.employeeType as string,
        shiftType: formData.shiftType as string,
        outOfState: formData.outOfState as string,
      },
      {
        new: true,
      }
    );
    console.log("📗 LOG [ updatedShift ]:", updatedShift);

    revalidatePath("/NewDay");
    console.log(green("Record updated successfully"));
    return {
      message: "Form Action Success!",
      data: parsed.data,
    };
  } catch (error: unknown) {
    console.log(red("DB Error: Could not update record:"));
    console.log((error as Error).message);
    return {
      message: (error as Error).message,
      data: formData,
      error: true,
    };
  }
};

// - Get all users
export const getUsersAction = async () => {
  try {
    await connectDB();

    // Get all users and return them
    const users = await User.find();

    revalidatePath("/NewDay");
    console.log(green("Users fetched successfully"));
    console.log("📗 LOG [ users ]:", users);

    return {
      message: "Got users successfully!",
      data: JSON.parse(JSON.stringify(users)),
    };
  } catch (error: unknown) {
    console.log(red("DB Error: Could not retrieve user records:"));
    console.log((error as Error).message);
    return {
      message: (error as Error).message,
      data: {},
      error: true,
    };
  }
};
