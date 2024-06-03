"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { schema } from "./formSchema";
import { contactFormAction, getUsersAction } from "./contactFormAction";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// - UI Components
import { Button } from "../ui/button";
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
} from "../ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

//
const getData = async () => {
  // "use server";
  const res = await getUsersAction();
  console.log("📗 [ Data ]:", res);
};
//
//
// - Main Component
const ContactForm = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const ref = React.useRef<HTMLFormElement>(null);
  const [users, setUsers] = useState<any[]>([]);

  const getData = async () => {
    const res = await getUsersAction();
    console.log("📗 [ Data ]:", res);
    setUsers(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    getData();
  }, []);

  const defaultValues = {
    name: "",
    shiftDate: new Date(),
    location: "",
  };

  // - Validation
  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  // {
  //   "_id": { "$oid": "665e1347a8a09c914a9c3b3e" },
  //   "name": "Omar",
  //   "shiftDate": "25-mar-24",
  //   "location": "VA"
  // }

  // - Form Submit
  const submitForm = async (values: z.infer<typeof schema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("location", values.location);
    formData.append("shiftDate", values.shiftDate.toLocaleString()); // Convert Date object to string
    // formData.append("shiftDate", "16-jun-24"); // Convert Date object to string

    console.log("🚧 LOG [ formData ]:", formData);

    setPending(true);
    // wait 1 second for testing purposes
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    const res = await contactFormAction(formData);

    // Reset the form
    form.reset(defaultValues);
    setPending(false);
    console.log("📗 [ Client message: ]:", res.message);
    console.log("📗 [ Data Submitted ]:", res.data);
    if (res.error) {
      console.error("📕 [ Error ]:", res.message);
      setError(res.message);
    } else {
      toast({
        variant: "success",
        title: "Success",
        description: "Your message has been sent!",
        // action: <ToastAction altText="Try again">Success</ToastAction>,
      });
    }
  };

  // - Markup
  return (
    <div className="mt-10 flex flex-col items-center px-4">
      <Card className="w-full px-6 py-8 shadow-lg dark:bg-darker md:w-[650px]">
        <CardHeader className="mb-4">
          <CardTitle className="mb-6 text-4xl font-bold text-primary">
            Enter a new day details
          </CardTitle>
          <CardDescription>
            Enter the date and details about the employees and the shifts they
            worked.
          </CardDescription>
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
                    <FormLabel>Shift Date</FormLabel>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
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
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {field.value ? (
                            <SelectValue placeholder="Employee Name" />
                          ) : (
                            "Employee Name"
                          )}
                          {/* <SelectValue placeholder="Select a warehouse" /> */}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="brooks">Brooks</SelectItem>
                        <SelectItem value="yasiel">Yasiel</SelectItem>
                        {users.map((user, i) => (
                          <SelectItem key={i} value={user.name}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Dropdown */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {field.value ? (
                            <SelectValue placeholder="Select a warehouse" />
                          ) : (
                            "Select a warehouse"
                          )}
                          {/* <SelectValue placeholder="Select a warehouse" /> */}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fidelitone">Fidelitone</SelectItem>
                        <SelectItem value="hubGroup">Hub Group</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      You can manage email addresses in your{" "}
                      <Link href="/examples/forms">email settings</Link>.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-16 flex justify-end">
                <Button
                  type="submit"
                  disabled={pending}
                  className="h-12 w-full"
                >
                  {pending ? "Sending..." : "Send Message"}
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
    </div>
  );
};

export default ContactForm;
