"use server";

import { schema } from "@/app/new_day/formSchema";
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
  weeks?: {
    thisWeek: {
      firstday: string;
      lastday: string;
    };
    fidelitoneWeek: {
      firstday: string;
      lastday: string;
    };
    hupGroupWeek: {
      firstday: string;
      lastday: string;
    };
  };
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
    firstdayTemp.setDate(firstdayTemp.getDate() + 7)
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

// get day of the week
function getDayOfTheWeek(date: Date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return { day: days[date.getDay()], index: days.indexOf(days[date.getDay()]) };
}

// - Form Action
export const getShiftsAction = async (): Promise<FormState> => {
  try {
    await connectDB();

    revalidatePath("/NewDay");
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
  const previousWeek = await getPreviousWeek(formData.startDate as string, 1);

  // Get the week's ranges on days
  const fidelitoneWeek = await getWeek(previous2Weeks);
  const hupGroupWeek = await getWeek(previousWeek);
  const thisWeek = await getWeek(formData.startDate as string);

  // console.log("📗 LOG [ thisWeek ]:", thisWeek);
  // console.log("📗 LOG [ fidelitoneWeek ]:", fidelitoneWeek);
  // console.log("📗 LOG [ hupGroupWeek ]:", hupGroupWeek);

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
    // console.log("📗 LOG [ shifts ]:", shifts);

    // TODO: Add the day property here to each one of the shifts
    const shiftsWithDay = shifts.map((shift) => {
      return {
        ...shift._doc,
        day: getDayOfTheWeek(shift.shiftDate),
        // location: getParsedLocation(shift.location),
      };
    });
    console.log("📗 LOG [ shiftsWithDay ]:", shiftsWithDay);

    //  split shifts by name
    const shiftsByUser = shiftsWithDay.reduce((acc, shift) => {
      if (!acc[shift.name]) {
        acc[shift.name] = [];
      }
      acc[shift.name].push(shift);
      return acc;
    }, {});

    console.log("📗 LOG [ shiftsByUser ]:", shiftsByUser);

    interface Shift {
      day: {
        index: number;
      };
    }

    revalidatePath("/NewDay");
    console.log(green("Record created successfully"));

    return {
      message: "Form Action Success!",
      // data: "shifts",
      data: JSON.parse(JSON.stringify(shiftsByUser)),
      weeks: {
        thisWeek,
        fidelitoneWeek,
        hupGroupWeek,
      },
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

export async function getYearlyDataAction(formData: FormData) {
  try {
    await connectDB();

    const startDate = new Date(2024, 0, 1); // January 1, 2024
    const endDate = new Date(2024, 11, 31); // December 31, 2024

    const yearlyStats = await Shift.aggregate([
      // Match shifts only from 2024
      {
        $match: {
          shiftDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      // Group by employee name
      {
        $group: {
          _id: {
            name: "$name",
            shiftType: "$shiftType",
          },
          shiftsCount: { $sum: 1 },
          totalHours: { $sum: "$hours" },
          shifts: { $push: "$$ROOT" },
        },
      },
      // Group again to organize by employee
      {
        $group: {
          _id: "$_id.name",
          totalShifts: { $sum: "$shiftsCount" },
          totalHours: { $sum: "$totalHours" },
          locations: { $addToSet: "$shifts.location" },
          firstShift: { $min: "$shifts.shiftDate" },
          lastShift: { $max: "$shifts.shiftDate" },
          shiftTypes: {
            $push: {
              type: "$_id.shiftType",
              count: "$shiftsCount",
              hours: "$totalHours",
              shifts: "$shifts",
            },
          },
        },
      },
      // Format the output
      {
        $project: {
          _id: 0,
          name: "$_id",
          totalShifts: 1,
          totalHours: { $round: ["$totalHours", 2] },
          averageHours: {
            $round: [{ $divide: ["$totalHours", "$totalShifts"] }, 2],
          },
          uniqueLocations: {
            $reduce: {
              input: "$locations",
              initialValue: [],
              in: { $setUnion: ["$$value", "$$this"] },
            },
          },
          firstShift: 1,
          lastShift: 1,
          shiftTypes: 1,
        },
      },
      // Sort by total hours (descending)
      {
        $sort: { totalHours: -1 },
      },
    ]);

    return {
      data: JSON.parse(JSON.stringify(yearlyStats)),
      message: "Successfully aggregated shifts for 2024",
    };
  } catch (error) {
    console.log(red("Error fetching yearly data:"));
    console.log((error as Error).message);
    return {
      data: [],
      message: "Failed to fetch yearly data",
      error: true,
    };
  }
}
