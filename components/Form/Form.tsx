"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import SubmitButton from "./SubmitButton";

import { contactFormAction } from "@/app/actions/contactFormAction";
import { schema } from "./formSchema";

const ContactForm = () => {
  // - Validation
  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: "",
      name: "",
      date: "",
      location: "",
    },
  });

  // - Form Action
  const ref = React.useRef<HTMLFormElement>(null);

  const formAction = async (formData: FormData) => {
    ref.current?.reset();

    const res = await contactFormAction(formData);
    console.log("📗 [ formAction? ]:", res);
  };

  // - Form Submit
  const onSubmit = async (data: z.output<typeof schema>) => {
    console.log("📗 [ onSubmit? ]:", data);
    // const formData = new FormData();

    // for (const key in data) {
    //   formData.append(key, data[key]);
    // }

    // await formAction(formData);
  };

  return (
    <div className="mt-10 flex flex-col items-center px-4">
      <Card className="w-full shadow-lg dark:bg-darker md:w-[650px]">
        <CardHeader>
          <CardTitle>Contact EHC</CardTitle>
          <CardDescription>
            Send us a direct message and a member of our team will reach out to
            you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: Implement the actual shadcn form here */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Employee Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the employee name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Location" {...field} />
                    </FormControl>
                    <FormDescription>
                      What warehouse did the employee worked at.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </CardContent>
        {/* <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Deploy</Button>
        </CardFooter> */}
      </Card>
    </div>
  );
};

export default ContactForm;
