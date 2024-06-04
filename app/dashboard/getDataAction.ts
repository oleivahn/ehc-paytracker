"use server";

import { schema } from "@/components/Form/formSchema";
import connectDB from "@/lib/database-connection";
import User from "@/models/user";
import Shift from "@/models/shift";

import { green, red } from "console-log-colors";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

// - What we return
export type FormState = {
  message: string;
  data: object | null | string;
  error?: boolean | null;
};

const getWeek = (date?: string) => {
  // - Get the date's week
  const curr = date ? new Date(date) : new Date(); // get current date
  let first = curr.getDate() - curr.getDay();
  const firstdayOb = new Date(curr.setDate(first));
  const firstday = firstdayOb.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const firstdayTemp = firstdayOb;

  const lastday = new Date(
    firstdayTemp.setDate(firstdayTemp.getDate() + 6)
  ).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return {
    firstday,
    lastday,
  };
};

const getPreviousWeek = (date: string, daysBefore: number) => {
  const currentTime = new Date(date);
  const goToWeek = daysBefore * 7; // Conver days to weeks
  currentTime.setDate(currentTime.getDate() - goToWeek);
  console.log("📗 LOG [ currentTime ]:", currentTime);

  return new Date(currentTime).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// - Form Action
export const getShiftsAction = async (): Promise<FormState> => {
  try {
    await connectDB();

    // const user = await User.findById(userId);
    // console.log("📗 LOG [ user ]:", user);

    // if (!user) {
    //   return {
    //     message: "User Not Found",
    //     data: "No User Found",
    //   };
    // }

    // const shifts = await Shift.find({ user: new Types.ObjectId(userId) });
    // console.log("📗 LOG [ shifts ]:", shifts);

    revalidatePath("/contactUs");
    console.log(green("Record created successfully"));
    return {
      message: "Got users successfully!",
      // data: JSON.parse(JSON.stringify(users)),
      data: "Got users successfully!",
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

export const getDataAction = async (data: FormData): Promise<FormState> => {
  const formData = Object.fromEntries(data);

  // Get day - 2 weeks and 3 weeks ago (mpn, tue ...)
  const previous2Weeks = await getPreviousWeek(formData.startDate as string, 2);
  const previous3Weeks = await getPreviousWeek(formData.startDate as string, 3);

  // Get the week's ranges on days
  const fidelitoneWeek = await getWeek(previous2Weeks);
  const hupGroupWeek = await getWeek(previous3Weeks);
  const thisWeek = await getWeek(formData.startDate as string);

  console.log("📗 LOG [ thisWeek ]:", thisWeek);
  console.log("📗 LOG [ fidelitoneWeek ]:", fidelitoneWeek);
  console.log("📗 LOG [ hupGroupWeek ]:", hupGroupWeek);

  try {
    // - Do something here
    await connectDB();

    // TODO: GET all shifts within the main week
    // mongoose get all shifts within the week
    const shifts = await Shift.find({
      shiftDate: {
        $gte: new Date(thisWeek.firstday),
        $lt: new Date(thisWeek.lastday),
      },
    });

    //  split shifts by name
    const shiftsByUser = shifts.reduce((acc, shift) => {
      if (!acc[shift.name]) {
        acc[shift.name] = [];
      }
      acc[shift.name].push(shift);
      return acc;
    }, {});

    console.log("📗 LOG [ shifts ]:", shiftsByUser);

    revalidatePath("/contactUs");
    console.log(green("Record created successfully"));

    return {
      message: "Form Action Success!",
      data: "shifts",
      // data: JSON.parse(JSON.stringify(shifts)),
      // error: true,
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
