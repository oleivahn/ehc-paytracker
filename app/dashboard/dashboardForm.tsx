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
    shiftCode = "(Driver)";
  } else if (shiftType === "helper") {
    shiftCode = "(Helper)";
  } else if (shiftType === "thirdMan") {
    shiftCode = "(3rd Man)";
  } else {
    shiftCode = "Unknown";
  }
  return shiftCode;
};

const getTotalforEmployee = (employee: any) => {
  console.log("📗 LOG [ employee ]:", employee);
  let total = 0;

  if (employee.user !== "Jose Furet") {
    employee.shifts.forEach((shift: any) => {
      switch (shift.shiftType) {
        case "driver":
          total += 200;
          break;
        case "helper":
          total += 150;
          break;
        case "thirdMan":
          total += 135;
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

  const getData = async () => {
    const res = await getShiftsAction();
    console.log("📗 [ getShiftsAction ]:", res);
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

    getData();
  }, []);

  const defaultValues = {
    shiftDate: undefined,
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
    console.log("📗 LOG [ res ]:", res);

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

  // - Markup
  return (
    <div className="mt-10 flex flex-col items-center md:px-4">
      <Card className="w-full shadow-lg dark:bg-darker md:w-[650px] md:px-6 md:py-8">
        <CardHeader className="mb-4">
          <CardTitle className="text-3xl font-bold text-primary md:text-4xl">
            Select a week to view a report
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
                    <FormLabel>Start Date</FormLabel>
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
            <span className="pr-4">Fidelitone:</span>
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
            Driver: $200 - Helper: $150 - 3rdMan: $135
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
                  const dayNumber = parseInt(firstDayofWeek.split(" ")[1]);

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
                      // console.log("📗 LOG!!! [ day ]:", day);
                      const shift = data.shifts.find(
                        (shift: any) => shift.day === day
                      );
                      return (
                        <TableCell key={index}>
                          {shift
                            ? `${getParsedLocation(
                                shift.location
                              )} ${getShiftCode(shift.shiftType)} `
                            : ""}
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

      {data && (
        <div className="mt-8">
          {/* <pre>{JSON.stringify(weeks, null, 2)}</pre>
          <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </div>
      )}
    </div>
  );
};

export default DashboardForm;
