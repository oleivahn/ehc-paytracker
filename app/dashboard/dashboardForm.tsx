"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { schema } from "./dashboardValidationSchema";
import {
  getDataAction,
  getShiftsAction,
  getYearlyDataAction,
} from "./getDataAction";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// - UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";

//
const getParsedLocation = (location: string) => {
  let parsedLocation = "";
  if (location === "fidelitone") {
    parsedLocation = "Fidelitone";
  } else if (location === "hubGroup") {
    parsedLocation = "HubGroup";
  } else {
    parsedLocation = "Unknown";
  }
  return parsedLocation;
};

const getShiftCode = (shiftType: string) => {
  let shiftCode = "";
  if (shiftType === "driver") {
    shiftCode = "Driver";
  } else if (shiftType === "helper") {
    shiftCode = "Ayudante";
  } else if (shiftType === "thirdMan") {
    shiftCode = "3rd Man";
  } else {
    shiftCode = "Unknown";
  }
  return shiftCode;
};

const isOutOfState = (outOfState: boolean) => {
  let isOutOfState = "";
  if (outOfState === true) {
    isOutOfState = " + OOS";
  } else {
    isOutOfState = "";
  }
  return isOutOfState;
};

const getTotalforEmployee = (employee: any) => {
  console.log("📗 LOG [ employee ]:", employee);
  let total = 0;

  if (employee.user !== "Jose Furet") {
    employee.shifts.forEach((shift: any) => {
      switch (shift.shiftType) {
        case "driver":
          if (shift.outOfState === true) {
            total += 250;
          } else {
            total += 200;
          }
          break;
        case "helper":
          if (shift.outOfState === true) {
            total += 200;
          } else {
            total += 150;
          }
          break;
        case "thirdMan":
          if (shift.outOfState === true) {
            total += 165;
          } else {
            total += 135;
          }
          break;
        default:
          total += 0;
      }
    });
  } else {
    employee.shifts.forEach((shift: any) => {
      switch (shift.shiftType) {
        case "driver":
          total += 700;
          break;
        case "helper":
          total += 700;
          break;
        case "thirdMan":
          total += 700;
          break;
        default:
          total += 0;
      }
    });
  }

  return total;
};

const getYearlyTotal = (employee: any) => {
  return getTotalforEmployee(employee);
};

interface YearlyData {
  name: string;
  totalShifts: number;
  totalHours: number;
  totalEarnings: number;
  shifts: Array<{
    shiftDate: Date;
    hours: number;
    earnings: number;
    location: string;
  }>;
}

//
//
// - Main -
const DashboardForm = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [data, setData] = useState<any>([]);
  const [weeks, setWeeks] = useState<any>([]);
  const ref = React.useRef<HTMLFormElement>(null);
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const getData = async () => {
    const res = await getShiftsAction();
    console.log("📗 [ getShiftsAction ]:", res);
    console.log("📗 [ shiftsInfo ]:", res.data);
    setData(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    console.log("FIRST RUN:");
    // - Get date - 2 weeks
    const currentTime = new Date();
    currentTime.setDate(currentTime.getDate() - 14);
    console.log("📗 LOG [ currentTime ]:", currentTime);

    const newDate = new Date(currentTime).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    console.log("📗 LOG [ newDate ]:", newDate);

    // - Get the date's week
    const curr = new Date(newDate); // get current date
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
    console.log(firstday);
    console.log(lastday);

    // getData();
  }, []);

  const defaultValues = {
    shiftDate: new Date(),
  };

  // Validation
  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  // Form Submit
  const submitForm = async (values: z.infer<typeof schema>) => {
    const formData = new FormData();
    formData.append("startDate", values.shiftDate?.toISOString() ?? ""); // Convert Date object to string

    console.log("🚧 LOG [ formData ]:", formData);

    setPending(true);
    const res = await getDataAction(formData);
    console.log("📗 LOG [ res ] AFTER getDataAction:", res);

    // Grab the data coming from the server and format it
    type Shift = {
      day: string;
      dayIndex: number;
      location: string;
    };

    type UserShifts = {
      user: string;
      salary: string;
      employeeType: string;
      shifts: Shift[];
    };

    let result: UserShifts[] = [];

    if (res.data) {
      console.log("📗 LOG [ res.data ] BEFORE SHIFTS LOOP:", res.data);
      for (let user in res.data as Object) {
        let salary = "";
        let employeeType = "";
        let shifts = (res.data as any)[user].map((shift: any) => {
          console.log("📗 LOG [ SHIFTY SHIFTY ]:", shift);
          salary = shift.salary;
          employeeType = shift.employeeType;
          return {
            day: shift.day.day,
            dayIndex: shift.day.index,
            location: shift.location,
            shiftType: shift.shiftType,
            outOfState: shift.outOfState,
          };
        });

        result.push({
          user: user,
          salary: salary,
          employeeType: employeeType,
          shifts: shifts,
        });
      }
    }

    console.log(result);

    // Reset the form
    form.reset(defaultValues);

    setData(result);
    setWeeks(res.weeks);
    // setData(JSON.stringify(result, null, 2));

    setPending(false);
    console.log("📗 [ Client message: ]:", res.message);
    console.log("📗 [ Data Submitted ]:", res.data);
    if (res.error) {
      console.error("📕 [ Error ]:", res.message);
      setError(res.message);
    } else {
      setError("");
      // toast({
      //   variant: "success",
      //   title: "Success",
      //   description: "Your message has been sent!",
      //   // action: <ToastAction altText="Try again">Success</ToastAction>,
      // });
      console.log("Success dashboard!");
    }
  };

  const handleYearlyReport = async () => {
    const formData = new FormData();
    formData.append("year", "2024");

    setPending(true);
    const res = await getYearlyDataAction(formData);
    console.log("Raw response data:", res.data);

    if (res.data) {
      const processedData = res.data.map((employee: any) => {
        let totalEarnings = 0;
        let shiftCounts = {
          driver: {
            regular: 0,
            outOfState: 0,
            total: 0,
          },
          helper: {
            regular: 0,
            outOfState: 0,
            total: 0,
          },
          thirdMan: {
            regular: 0,
            outOfState: 0,
            total: 0,
          },
        };

        // Array to store detailed shift information
        let detailedShifts: Array<{
          date: string;
          shiftType: string;
          location: string;
          outOfState: boolean;
          earnings: number;
        }> = [];

        if (!employee || !employee.shiftTypes) {
          console.error("Invalid employee data:", employee);
          return {
            name: employee?.name || "Unknown",
            totalShifts: 0,
            shiftCounts,
            totalEarnings: 0,
            detailedShifts: [],
          };
        }

        if (employee.name !== "Jose Furet") {
          // Loop through each shift type group
          employee.shiftTypes.forEach((shiftTypeGroup: any) => {
            // Loop through individual shifts within the group
            shiftTypeGroup.shifts.forEach((shift: any) => {
              const shiftType = shift.shiftType as keyof typeof shiftCounts;
              let shiftEarnings = 0;

              // Increment appropriate counters
              if (shift.outOfState) {
                shiftCounts[shiftType].outOfState++;
              } else {
                shiftCounts[shiftType].regular++;
              }
              shiftCounts[shiftType].total++;

              // Calculate earnings
              switch (shiftType) {
                case "driver":
                  shiftEarnings = shift.outOfState ? 250 : 200;
                  break;
                case "helper":
                  shiftEarnings = shift.outOfState ? 200 : 150;
                  break;
                case "thirdMan":
                  shiftEarnings = shift.outOfState ? 165 : 135;
                  break;
              }

              totalEarnings += shiftEarnings;

              // Add to detailed shifts array
              detailedShifts.push({
                date: new Date(shift.shiftDate).toLocaleDateString(),
                shiftType: shift.shiftType,
                location: shift.location,
                outOfState: shift.outOfState,
                earnings: shiftEarnings,
              });
            });
          });
        } else {
          // Special case for Jose Furet - $700 per shift
          totalEarnings = employee.totalShifts * 700;

          // For Jose, we'll use the shiftType counts from the groups
          employee.shiftTypes.forEach((shiftTypeGroup: any) => {
            const shiftType = shiftTypeGroup.type as keyof typeof shiftCounts;
            shiftCounts[shiftType].total = shiftTypeGroup.count;
            shiftCounts[shiftType].regular = shiftTypeGroup.count;

            // Add detailed shifts for Jose
            shiftTypeGroup.shifts.forEach((shift: any) => {
              detailedShifts.push({
                date: new Date(shift.shiftDate).toLocaleDateString(),
                shiftType: shift.shiftType,
                location: shift.location,
                outOfState: shift.outOfState,
                earnings: 700,
              });
            });
          });
        }

        // Sort detailed shifts by date
        detailedShifts.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        return {
          name: employee.name,
          totalShifts: employee.totalShifts,
          shiftCounts,
          totalEarnings: totalEarnings,
          detailedShifts,
        };
      });

      console.log("Processed yearly totals:", processedData);
      setYearlyData(processedData);
    }

    setPending(false);
  };

  // - Markup
  return (
    <div className="mt-10 flex flex-col items-center md:px-4">
      <Card className="w-full shadow-lg dark:bg-darker md:w-[650px] md:px-6 md:py-8">
        <CardHeader className="mb-4">
          <CardTitle className="text-3xl font-bold text-primary md:text-4xl">
            Select a week to view a report!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitForm)}
              ref={ref}
              className="space-y-6"
            >
              {/* TODO: Move the calendar to the right */}
              {/* Date */}
              <FormField
                control={form.control}
                name="shiftDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Select Week</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          // disabled={(date) =>
                          //   date > new Date() || date < new Date("1900-01-01")
                          // }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* </div> */}

              <div className="mt-16 flex justify-end">
                <Button
                  type="submit"
                  disabled={pending}
                  className="h-12 w-full"
                >
                  {pending ? "Switching..." : "Go to week"}
                </Button>
                {/* <SubmitButton /> */}
              </div>
              {error && (
                <>
                  <div className="mt-4 text-center text-red-500">
                    Server Error:
                  </div>
                  <div className="text-center text-red-500">{error}</div>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
      {/* TODO: Get the real conditional rendering here */}
      <div className="my-4 w-full rounded-lg bg-white pb-6 pt-4 shadow-lg dark:bg-darker md:mt-6 md:w-[1200px] md:px-6 md:pb-8">
        <div className="mb-4 px-4">
          <h3 className="mb-2 pt-6 text-xl font-bold text-primary md:pt-4 md:text-3xl">
            {weeks.thisWeek && weeks.thisWeek.firstday
              ? weeks.thisWeek.firstday.replace(/, 2024/g, "")
              : "Select a week"}{" "}
            - {/* TODO: Get the actual year */}
            {weeks.thisWeek && weeks.thisWeek.lastday
              ? weeks.thisWeek.lastday.replace(/, 2024/g, "") + ", 2024"
              : ""}
          </h3>
          <p className="opacity-30">
            <span className="pr-4">Fidelitone: </span>
            {weeks.fidelitoneWeek && weeks.fidelitoneWeek.firstday
              ? weeks.fidelitoneWeek.firstday.replace(/, 2024/g, "")
              : ""}{" "}
            -{" "}
            {weeks.thisWeek && weeks.thisWeek.lastday
              ? weeks.fidelitoneWeek.lastday.replace(/, 2024/g, "")
              : ""}
          </p>
          <p className="opacity-30">
            <span className="pr-4">Hub Group:</span>
            {weeks.hupGroupWeek && weeks.hupGroupWeek.firstday
              ? weeks.hupGroupWeek.firstday.replace(/, 2024/g, "")
              : ""}{" "}
            -{" "}
            {weeks.hupGroupWeek && weeks.hupGroupWeek.lastday
              ? weeks.hupGroupWeek.lastday.replace(/, 2024/g, "")
              : ""}
          </p>
        </div>
        <Table>
          <TableCaption>
            {/* <p className="opacity-30">
              <span className="pr-4">Fidelitone: </span>
              {weeks.fidelitoneWeek && weeks.fidelitoneWeek.firstday
                ? weeks.fidelitoneWeek.firstday.replace(/, 2024/g, "")
                : ""}{" "}
              -{" "}
              {weeks.thisWeek && weeks.thisWeek.lastday
                ? weeks.fidelitoneWeek.lastday.replace(/, 2024/g, "")
                : ""}
            </p>
            <p className="opacity-30">
              <span className="pr-4">Hub Group:</span>
              {weeks.hupGroupWeek && weeks.hupGroupWeek.firstday
                ? weeks.hupGroupWeek.firstday.replace(/, 2024/g, "")
                : ""}{" "}
              -{" "}
              {weeks.hupGroupWeek && weeks.hupGroupWeek.lastday
                ? weeks.hupGroupWeek.lastday.replace(/, 2024/g, "")
                : ""}
            </p> */}
            <p className="mt-2 opacity-30">
              Driver: $200 - Helper: $150 - 3rdMan: $135
            </p>
            <p className="mt-2 opacity-30">
              Out of State Driver: $250 - Helper: $200 - 3rdMan: $165
            </p>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">Name</TableHead>
              {weeks &&
                [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day, index) => {
                  const firstDayofWeek =
                    weeks?.thisWeek?.firstday || "Sunday 1";
                  console.log("📗 LOG [ firstDayofWeek ]:", firstDayofWeek);

                  // TODO: Fix the day number (getDate()?)
                  const dayNumber = new Date(firstDayofWeek).getDate();
                  console.log("📗 LOG [ dayNumber ]:", dayNumber);

                  return (
                    <TableHead className="text-nowrap" key={index}>{`${day}, ${
                      index + dayNumber
                    }`}</TableHead>
                  );
                })}
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((data: any) => {
                console.log("📗 LOG [ data on dashboard ]:", data);
                // const total = data.shifts.length * data.salary;
                const total = getTotalforEmployee(data);
                return (
                  <TableRow key={data.user}>
                    <TableCell className="font-medium">{data.user}</TableCell>
                    {[
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ].map((day, index) => {
                      console.log("📗 LOG!!! [ day ]:", day);
                      const shift = data.shifts.find(
                        (shift: any) => shift.day === day
                      );
                      return (
                        <TableCell key={index}>
                          <div>
                            <span
                              className={
                                shift
                                  ? `${
                                      shift.location === "fidelitone" &&
                                      "text-[#ffbb52]"
                                    }`
                                  : ""
                              }
                            >
                              {shift
                                ? `${getParsedLocation(shift.location)}`
                                : ""}
                            </span>
                          </div>
                          <span className="text-[#2db0ff]">
                            {shift
                              ? `${getShiftCode(
                                  shift.shiftType
                                )} ${isOutOfState(shift.outOfState)}`
                              : ""}
                          </span>
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-right">${total}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>Total</TableCell>
              <TableCell className="text-right">
                $
                {data
                  .reduce(
                    (sum: number, user: any) =>
                      sum + user.shifts.length * user.salary,
                    0
                  )
                  .toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <Button
        onClick={handleYearlyReport}
        className="mb-6 w-full md:w-[650px]"
        disabled={pending}
      >
        Generate 2024 Yearly Report
      </Button>

      {yearlyData && yearlyData.length > 0 && (
        <Card className="mb-6 w-full shadow-lg dark:bg-darker md:w-[650px] md:px-6 md:py-8">
          <CardHeader>
            <CardTitle>2024 Yearly Totals - May 24, 2024 and up</CardTitle>
          </CardHeader>
          <CardContent>
            <pre>
              {JSON.stringify(
                yearlyData.map((employee) => ({
                  name: employee.name,
                  totalShifts: employee.totalShifts,
                  totalEarnings: employee.totalEarnings,
                })),
                null,
                2
              )}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardForm;
