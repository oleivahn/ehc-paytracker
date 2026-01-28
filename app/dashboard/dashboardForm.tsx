"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { schema } from "./dashboardValidationSchema";
import { getDataAction, getShiftsAction } from "./getDataAction";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn, capitalizeWords } from "@/lib/utils";

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
  if (!employee.shifts) return 0;

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

  return employee.shifts.reduce((total: number, shift: any) => {
    if (employee.user === "Jose Furet") {
      return total + rates.jose[shift.shiftType as keyof typeof rates.jose];
    }

    const rateTable = shift.outOfState ? rates.outOfState : rates.regular;
    return total + rateTable[shift.shiftType as keyof typeof rateTable];
  }, 0);
};

//
//
// - Main -
const DashboardForm = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();
  const [data, setData] = useState<any>([]);
  const [weeks, setWeeks] = useState<any>([]);
  const ref = React.useRef<HTMLFormElement>(null);

  const getData = async () => {
    const res = await getShiftsAction();
    console.log("📗 [ getShiftsAction ]:", res);
    console.log("📗 [ shiftsInfo ]:", res.data);
    setData(Array.isArray(res.data) ? res.data : []);
  };

  // Load current week on initial page load
  useEffect(() => {
    const loadCurrentWeek = async () => {
      const formData = new FormData();
      formData.append("startDate", new Date().toISOString());

      setPending(true);
      const res = await getDataAction(formData);

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
        for (let user in res.data as Object) {
          let salary = "";
          let employeeType = "";
          let shifts = (res.data as any)[user].map((shift: any) => {
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

      setData(result);
      setWeeks(res.weeks);
      setPending(false);
    };

    loadCurrentWeek();
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

    console.log("📗 LOG [ data results ]:", result);

    // Reset the form
    // form.reset(defaultValues);

    // Calculate totals across all users
    const totals = calculateTotalEarnings(result);
    console.log(
      "📗 LOG [ Total earnings across all users ]: $",
      totals.toFixed(2)
    );

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

  const calculateTotalEarnings = (users: any[]) => {
    return users.reduce((acc, user) => {
      let userTotal = 0;
      user.shifts.forEach((shift: any) => {
        let shiftAmount = 0;

        // Calculate based on shift type and out of state status
        if (shift.shiftType === "driver") {
          shiftAmount = shift.outOfState ? 250 : 200;
        } else if (shift.shiftType === "helper") {
          shiftAmount = shift.outOfState ? 200 : 150;
        } else if (shift.shiftType === "thirdMan") {
          shiftAmount = shift.outOfState ? 165 : 135;
        }

        userTotal += shiftAmount;
      });

      return acc + userTotal;
    }, 0);
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
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
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
                          onSelect={(date) => {
                            field.onChange(date);
                            setCalendarOpen(false);
                          }}
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
              {weeks?.thisWeek?.firstday &&
                [0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                  // Create a new Date object from the first day of the week
                  const firstDate = new Date(weeks.thisWeek.firstday);
                  const currentDate = new Date(firstDate);
                  currentDate.setDate(firstDate.getDate() + dayOffset);

                  const dayName = currentDate.toLocaleDateString("en-US", {
                    weekday: "long",
                  });
                  const dayNumber = currentDate.getDate();

                  return (
                    <TableHead className="text-nowrap" key={dayOffset}>
                      {`${dayName}, ${dayNumber}`}
                    </TableHead>
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
                    <TableCell className="font-medium">
                      {capitalizeWords(data.user)}
                    </TableCell>
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
                ${calculateTotalEarnings(data)}
                {/* {data
                  .reduce(
                    (sum: number, user: any) =>
                      sum + user.shifts.length * user.salary,
                    0
                  )
                  .toFixed(2)} */}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default DashboardForm;
