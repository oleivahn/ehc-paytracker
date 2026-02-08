"use server";

import { schema } from "@/app/new_day/formSchema";
import connectDB from "@/lib/database-connection";
import Shift from "@/models/shift";
import User from "@/models/user";
import { logger } from "@/lib/logger";
import { getAuthUserInfo } from "@/lib/authHelper";

import mongoose, { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { capitalizeWords } from "@/lib/utils";

// - What we return
export type FormState = {
  message: string;
  data: object | null | string;
  error?: boolean | null;
};

// - Add a new shift to MongoDB
export const contactFormAction = async (data: FormData): Promise<FormState> => {
  const { userId, userName, timestamp, timeOfDay } = await getAuthUserInfo();

  // Convert FormData to a regular object
  const formData: { [key: string]: any } = {};
  data.forEach((value, key) => (formData[key] = value));

  formData.outOfState = formData.outOfState === "true" ? true : false;

  logger.request("NEW SHIFT REQUEST", {
    userId,
    userName,
    timestamp,
    timeOfDay,
    data: formData,
  });

  // ! DO NOT USE Object.fromEntries(data) as it will not work with FormData, can't update the object
  // const formData = Object.fromEntries(data);
  // console.log("Object?", typeof formData);
  // console.log("📗 LOG on FormAction [ formData ]:", formData);

  const employeeUserId = formData.user as string;

  // if (!employeeUserId || !Types.ObjectId.isValid(employeeUserId)) {
  if (!employeeUserId) {
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
      name: (formData.name as string).toLowerCase(),
      shiftDate: formData.shiftDate as string,
    });

    if (shiftExists) {
      return {
        message: "Shift Already Exists",
        data: shiftExists,
      };
    }

    const user = await User.findById(employeeUserId);

    if (!user) {
      return {
        message: "User Not Found",
        data: "No User Found",
      };
    }

    const shifts = await Shift.find({
      user: new Types.ObjectId(employeeUserId),
    });

    // const newShift = new Shift(formData);
    const newShift = new Shift({
      name: (formData.name as string).toLowerCase(),
      firstName: user.firstName.toLowerCase(),
      lastName: user.lastName.toLowerCase(),
      shiftDate: formData.shiftDate as string,
      easyDate: formData.easyDate as string,
      location: formData.location as string,
      user: new Types.ObjectId(employeeUserId),
      salary: formData.salary as string,
      employeeType: formData.employeeType as string,
      shiftType: formData.shiftType as string,
      outOfState: formData.outOfState as boolean,
    });

    await newShift.save();
    revalidatePath("/NewDay");

    logger.success("Shift created successfully", {
      userId,
      userName,
      timestamp,
      timeOfDay,
    });
    return {
      message: "Form Action Success!",
      data: formData,
    };
  } catch (error: unknown) {
    logger.error("DB Error: Could not create shift", {
      userId,
      userName,
      timestamp,
      timeOfDay,
      error: (error as Error).message,
    });
    return {
      message: (error as Error).message,
      data: formData,
      error: true,
    };
  }
};

// - Update a shift in MongoDB
export const updateShiftAction = async (data: FormData) => {
  const { userId, userName, timestamp, timeOfDay } = await getAuthUserInfo();

  // Convert FormData to a regular object
  const formData: { [key: string]: any } = {};
  data.forEach((value, key) => (formData[key] = value));

  formData.outOfState = formData.outOfState === "true" ? true : false;

  logger.request("UPDATE SHIFT REQUEST", {
    userId,
    userName,
    timestamp,
    timeOfDay,
    data: formData,
  });

  // Check if shift exists
  const shiftExists = await Shift.exists({
    name: (formData.name as string).toLowerCase(),
    shiftDate: formData.shiftDate as string,
  });

  if (!shiftExists) {
    return {
      message: "Invalid form data sent to the server! [Shift doesnt exist]",
      data: "No Shift",
    };
  }

  const parsed = schema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data sent to the server! [Parse Error]",
      data: "Something didn't parse correctly!",
    };
  }

  const employeeUserId = formData.user as string;

  try {
    await connectDB();

    // Get user data to extract firstName and lastName
    const user = await User.findById(employeeUserId);
    if (!user) {
      return {
        message: "User Not Found",
        data: "No User Found",
        error: true,
      };
    }

    const updatedShift = await Shift.findOneAndUpdate(
      {
        name: (formData.name as string).toLowerCase(),
        shiftDate: formData.shiftDate as string,
      },
      {
        name: (formData.name as string).toLowerCase(),
        firstName: user.firstName.toLowerCase(),
        lastName: user.lastName.toLowerCase(),
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
      },
    );
    revalidatePath("/NewDay");
    logger.success("Shift updated successfully", {
      userId,
      userName,
      timestamp,
      timeOfDay,
    });
    return {
      message: "Form Action Success!",
      data: parsed.data,
    };
  } catch (error: unknown) {
    logger.error("DB Error: Could not update shift", {
      userId,
      userName,
      timestamp,
      timeOfDay,
      error: (error as Error).message,
    });
    return {
      message: (error as Error).message,
      data: formData,
      error: true,
    };
  }
};

// - Get all users
export const getUsersAction = async () => {
  const { userId, userName, timestamp, timeOfDay } = await getAuthUserInfo();

  logger.request("GET USERS REQUEST", {
    userId,
    userName,
    timestamp,
    timeOfDay,
  });
  try {
    await connectDB();

    // Get only active users
    const users = await User.find({ active: { $ne: false } });

    // Capitalize the name field for each user, fallback to firstName + lastName if name is empty
    const usersWithCapitalizedNames = users.map((user) => {
      const userObj = user.toObject();
      let displayName = userObj.name;

      // If name is empty or doesn't exist, create it from firstName and lastName
      if (!displayName || displayName.trim() === "") {
        displayName = `${userObj.firstName || ""} ${
          userObj.lastName || ""
        }`.trim();
      }

      return {
        ...userObj,
        name: capitalizeWords(displayName) || `User ${userObj._id}`, // Fallback to User ID if still empty
      };
    });

    revalidatePath("/NewDay");
    logger.success(
      `Users fetched successfully (${usersWithCapitalizedNames.length} users)`,
      {
        userId,
        userName,
        timestamp,
        timeOfDay,
      },
    );

    return {
      message: "Got users successfully!",
      data: JSON.parse(JSON.stringify(usersWithCapitalizedNames)),
    };
  } catch (error: unknown) {
    logger.error("DB Error: Could not retrieve users", {
      userId,
      userName,
      timestamp,
      timeOfDay,
      error: (error as Error).message,
    });
    return {
      message: (error as Error).message,
      data: {},
      error: true,
    };
  }
};
