"use client";
import React, { useState } from "react";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { schema } from "./dashboardValidationSchema";
import { getDataAction } from "./getDataAction";

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
//
//
// - Main -
const DashboardForm = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [data, setData] = useState<any>("");
  const ref = React.useRef<HTMLFormElement>(null);

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
    formData.append("startDate", values.shiftDate.toLocaleString()); // Convert Date object to string

    console.log("🚧 LOG [ formData ]:", formData);

    setPending(true);
    const res = await getDataAction(formData);

    // Reset the form
    form.reset(defaultValues);
    // setData(res.data);
    setData(JSON.stringify(res.data, null, 2));

    setPending(false);
    console.log("📗 [ Client message: ]:", res.message);
    console.log("📗 [ Data Submitted ]:", res.data);
    if (res.error) {
      console.error("📕 [ Error ]:", res.message);
      setError(res.message);
    } else {
      setError("");
      toast({
        variant: "success",
        title: "Success",
        description: "Your message has been sent!",
        // action: <ToastAction altText="Try again">Success</ToastAction>,
      });
    }
  };

  const invoices = [
    {
      invoice: "Brooks",
      paymentStatus: "Fidelitone",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "Yasiel",
      paymentStatus: "Hub Group",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
  ];

  const currentTime = new Date();
  currentTime.setDate(currentTime.getDate() - 14);
  console.log("📗 LOG [ currentTime ]:", currentTime);

  // - Markup
  return (
    <div className="mt-10 flex flex-col items-center px-4">
      <Card className="w-full px-6 py-8 shadow-lg dark:bg-darker md:w-[650px]">
        <CardHeader className="mb-4">
          <CardTitle className="text-4xl font-bold text-primary">
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
              {/* <div className="flex justify-items-end"> */}
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
      <div className="mt-6 w-full rounded-md bg-white px-6 py-8 shadow-lg dark:bg-darker md:w-[1050px]">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[100px]">Sunday</TableHead>
              <TableHead className="w-[100px]">Monday</TableHead>
              <TableHead className="w-[100px]">Tuesday</TableHead>
              <TableHead className="w-[100px]">Wednesday</TableHead>
              <TableHead className="w-[100px]">Thursday</TableHead>
              <TableHead className="w-[100px]">Friday</TableHead>
              <TableHead className="w-[100px]">Saturday</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell className="text-right">
                  {invoice.totalAmount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      {data && (
        <div className="mt-8">
          <pre>{data}</pre>
        </div>
      )}
    </div>
  );
};

export default DashboardForm;
