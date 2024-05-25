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
import { Textarea } from "../ui/textarea";
import { useFormState } from "react-dom";

const ContactForm = () => {
  // const [state, formAction] = useFormState(contactFormAction, {
  //   message: "",
  // });

  // - Validation
  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      // employeeId: "",
      name: "",
      // date: "",
      location: "",
      // email: "",
      // message: "",
    },
  });

  // - Form Action
  const ref = React.useRef<HTMLFormElement>(null);

  // - Form Submit
  const submitForm = async (values: z.infer<typeof schema>) => {
    console.log("📗 LOG [ data ]:", values);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("location", values.location);

    ref.current?.reset();

    const res = await contactFormAction(formData);

    console.log("📗 [ client ]:", res.message);
  };

  return (
    <div className="mt-10 flex flex-col items-center px-4">
      <Card className="w-full shadow-lg dark:bg-darker md:w-[650px]">
        <CardHeader>
          <CardTitle className="mb-6">Contact EHC</CardTitle>
          <CardDescription>
            Send us a direct message and a member of our team will reach out to
            you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: Implement the actual shadcn form here */}
          <Form {...form}>
            <form
              // action={formAction}
              onSubmit={form.handleSubmit(submitForm)}
              ref={ref}
              className="space-y-8"
            >
              {/* Name */}
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
              {/* Location */}
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
              {/* Email */}
              {/* <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              {/* Message */}
              {/* <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add text here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <div className="mt-16 flex justify-end">
                {/* <Button type="submit" className="h-12 w-full">
                  Send
                </Button> */}
                <SubmitButton />
              </div>
            </form>
          </Form>
        </CardContent>
        {/* <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Deploy</Button>
        </CardFooter> */}
        {/* <form className="m-4 flex gap-2" ref={ref} action={formAction}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" placeholder="Name of your project" />
          <label htmlFor="email">Email</label>
          <input id="email" name="email" placeholder="Name of your project" />
          <SubmitButton />
        </form> */}
      </Card>
    </div>
  );
};

export default ContactForm;
