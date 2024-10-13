"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { schema } from "./formSchema";
import {
  contactFormAction,
  getUsersAction,
  updateShiftAction,
} from "./contactFormAction";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ShadCn - Components
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
} from "../../components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
import { Checkbox } from "@/components/ui/checkbox";

type User = {
  _id: string;
  name: string;
  startDate: string;
  email: string;
  salary: string;
  employeeType: string;
  shiftType: string;
  __v: number;
};

// - Main Component
const ContactUs = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [updateShiftData, setUpdateShiftData] = useState(new FormData());
  const { toast } = useToast();
  const ref = React.useRef<HTMLFormElement>(null);
  const [users, setUsers] = useState<User[]>([]);

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
    easyDate: "",
    shiftType: "",
    location: "",
    outOfState: false,
  };

  // - Validation
  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const updateShift = async () => {
    console.log("📗 LOG [ updateShiftData ]:", updateShiftData);
    const res = await updateShiftAction(updateShiftData);

    if (res.error) {
      console.error("📕 [ Error ]:", res.message);
      setError(res.message);
    } else {
      toast({
        variant: "success",
        title: "Success",
        description: "Shift was updated successfully",
        action: <ToastAction altText="Try again">Success</ToastAction>,
      });
    }
    setOpenDialog(false);
  };

  const getId = (name: string) => {
    const user = users.find((user) => user.name === name);
    return user ? user._id : "";
  };
  const getSalary = (name: string) => {
    const user = users.find((user) => user.name === name);
    return user ? user.salary : "";
  };
  const getEmployeeType = (name: string) => {
    const user = users.find((user) => user.name === name);
    return user ? user.employeeType : "";
  };

  // - Form Submit
  const submitForm = async (values: z.infer<typeof schema>) => {
    console.log("📗 LOG [ values ]:", values);

    // - CAN ONLY SEND STRINGS
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("location", values.location);
    formData.append(
      "shiftDate",
      values.shiftDate.toLocaleString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    ); // Convert Date object to string (format: "Aug 10, 2024")
    formData.append("easyDate", values.shiftDate.toISOString().split("T")[0]); // Convert Date object to string (format: "2024-10-29")
    formData.append("salary", getSalary(values.name));
    formData.append("employeeType", getEmployeeType(values.name));
    formData.append("user", getId(values.name));
    formData.append("shiftType", values.shiftType);
    formData.append("outOfState", JSON.stringify(values.outOfState)); // Convert boolean to string

    console.log("🚧 LOG [ formData ]:", formData);

    setPending(true);
    // wait 1 second for testing purposes
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    const res = await contactFormAction(formData);

    if (res.message === "Shift Already Exists") {
      // TODO: Show modal to replace the shift
      setUpdateShiftData(formData);
      setOpenDialog(true);
      setPending(false);
      return;
    }
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
        description: "Success!",
        action: <ToastAction altText="Try again">Success</ToastAction>,
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
                        {users.map((user, i) => (
                          <div key={i}>
                            <SelectItem value={user.name} id={user._id}>
                              {user.name}
                            </SelectItem>
                            <input type="hidden" name="user" value={user._id} />
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Shift Type */}
              <FormField
                control={form.control}
                name="shiftType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {field.value ? (
                            <SelectValue placeholder="Select type of shift" />
                          ) : (
                            "Select shift"
                          )}
                          {/* <SelectValue placeholder="Select a warehouse" /> */}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="helper">Helper</SelectItem>
                        <SelectItem value="thirdMan">3rd Man</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* <FormDescription>
                      You can manage email addresses in your{" "}
                      <Link href="/examples/forms">email settings</Link>.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Out of state */}
              <FormField
                control={form.control}
                name="outOfState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mr-3">Out of State</FormLabel>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
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
                    {/* <FormDescription>
                      You can manage email addresses in your{" "}
                      <Link href="/examples/forms">email settings</Link>.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="mt-16 flex justify-end">
                <Button
                  type="submit"
                  disabled={pending}
                  className="h-12 w-full"
                >
                  {pending ? "Creating..." : "Finish"}
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
      <Dialog open={openDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Warning</DialogTitle>
            <DialogDescription>
              Shift already exists, would you like to update the shift anyway?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => updateShift()}>
              Update Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactUs;
