"use server";

import connectDB from "@/lib/database-connection";
import Shift from "@/models/shift";
import { green } from "console-log-colors";

export type WeeklyFormState = {
  message: string;
  data: WeeklyData[] | null;
  error?: boolean;
};

export type WeeklyData = {
  weekDate: string;
  weekStart: Date;
  earnings: number;
  shiftsCount: number;
};

// Rate calculation helper
const calculateEarnings = (shifts: any[]): number => {
  const rates = {
    regular: {
      driver: 200,
      helper: 150,
      thirdMan: 135,
    },
    outOfState: {
      driver: 250,
      helper: 200,
      thirdMan: 165,
    },
    jose: {
      driver: 700,
      helper: 700,
      thirdMan: 700,
    },
  };

  return shifts.reduce((total: number, shift: any) => {
    const name = shift.name?.toLowerCase() || "";
    if (name.includes("jose furet")) {
      return total + rates.jose[shift.shiftType as keyof typeof rates.jose];
    }

    const rateTable = shift.outOfState ? rates.outOfState : rates.regular;
    return total + (rateTable[shift.shiftType as keyof typeof rateTable] || 0);
  }, 0);
};

// Get the Sunday of the week for a given date
const getSundayOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
};

export async function getWeeklyDataAction(
  employeeName: string
): Promise<WeeklyFormState> {
  try {
    await connectDB();

    // Calculate date range: last 3 months from today
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    console.log(green(`Fetching weekly data for ${employeeName}`));
    console.log(green(`Start date: ${startDate.toISOString()}`));
    console.log(green(`End date: ${endDate.toISOString()}`));

    // Fetch all shifts for this employee in the date range
    const shifts = await Shift.find({
      name: { $regex: new RegExp(employeeName, "i") },
      shiftDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ shiftDate: -1 });

    console.log(green(`Found ${shifts.length} shifts for ${employeeName}`));

    // Group shifts by week (using Sunday as the week start)
    const weeklyMap = new Map<string, { shifts: any[]; weekStart: Date }>();

    shifts.forEach((shift) => {
      const sunday = getSundayOfWeek(shift.shiftDate);
      const weekKey = sunday.toISOString().split("T")[0];

      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, { shifts: [], weekStart: sunday });
      }
      weeklyMap.get(weekKey)!.shifts.push(shift);
    });

    // Convert to array and calculate earnings for each week
    const weeklyData: WeeklyData[] = Array.from(weeklyMap.entries())
      .map(([_, value]) => ({
        weekDate: value.weekStart.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          timeZone: "UTC",
        }),
        weekStart: value.weekStart,
        earnings: calculateEarnings(value.shifts),
        shiftsCount: value.shifts.length,
      }))
      .sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime());

    return {
      message: `Found ${weeklyData.length} weeks of data for ${employeeName}`,
      data: weeklyData,
    };
  } catch (error) {
    console.error("Error fetching weekly data:", error);
    return {
      message: "Failed to fetch weekly data",
      data: null,
      error: true,
    };
  }
}

// Get list of unique employee names from database (normalized to lowercase to avoid duplicates)
export async function getEmployeeListAction(): Promise<string[]> {
  try {
    await connectDB();

    const employees = await Shift.distinct("name");

    // Normalize names to lowercase and remove duplicates
    const normalizedNames = new Map<string, string>();
    employees.forEach((name: string) => {
      const lowerName = name.toLowerCase();
      // Keep the first occurrence (or you could prefer a specific casing)
      if (!normalizedNames.has(lowerName)) {
        normalizedNames.set(lowerName, name);
      }
    });

    // Return unique names sorted alphabetically
    return Array.from(normalizedNames.keys()).sort((a, b) =>
      a.localeCompare(b)
    );
  } catch (error) {
    console.error("Error fetching employee list:", error);
    return [];
  }
}
