"use server";

import connectDB from "@/lib/database-connection";
import Shift from "@/models/shift";
import { red, green } from "console-log-colors";

export type YearlyFormState = {
  message: string;
  data: object[] | null;
  error?: boolean;
};

export async function getYearlyDataAction(
  formData: FormData
): Promise<YearlyFormState> {
  try {
    await connectDB();

    const year = parseInt(formData.get("year") as string) || 2025;
    // Use UTC dates to avoid timezone issues
    const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0)); // January 1st of the year (UTC)
    const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)); // December 31st of the year (UTC)

    console.log(green(`Fetching yearly data for ${year}`));
    console.log(green(`Start date: ${startDate.toISOString()}`));
    console.log(green(`End date: ${endDate.toISOString()}`));

    // First, let's see all unique dates in the database for this year
    const allShiftsCount = await Shift.countDocuments({
      shiftDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    console.log(green(`Total shifts found for ${year}: ${allShiftsCount}`));

    const yearlyStats = await Shift.aggregate([
      // Match shifts from the specified year
      {
        $match: {
          shiftDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      // Group by employee name (normalized to lowercase for consistency)
      {
        $group: {
          _id: {
            name: { $toLower: "$name" },
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
      message: `Successfully aggregated shifts for ${year}`,
    };
  } catch (error) {
    console.log(red("Error fetching yearly data:"));
    console.log((error as Error).message);
    return {
      data: null,
      message: "Failed to fetch yearly data",
      error: true,
    };
  }
}
