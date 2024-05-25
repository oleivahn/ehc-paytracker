"use client";
import React, { useState } from "react";

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

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { schema } from "./formSchema";
import { contactFormAction } from "@/app/actions/contactFormAction";
import { Textarea } from "@/components/ui/textarea";

//
//
const ContactForm = () => {
  const [pending, setPending] = useState(false);
  const ref = React.useRef<HTMLFormElement>(null);

  const defaultValues = {
    // employeeId: "",
    name: "",
    // date: "",
    // location: "",
    email: "",
    message: "",
  };

  //
  // - Validation
  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  //
  // - Form Submit
  const submitForm = async (values: z.infer<typeof schema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("message", values.message);

    setPending(true);
    // wait 1 second for testing purposes
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const res = await contactFormAction(formData);

    // Reset the form
    form.reset(defaultValues);
    setPending(false);
    console.log("📗 [ client ]:", res.message);
  };

  return (
    <div className="mt-10 flex flex-col items-center px-4">
      <Card className="w-full px-6 py-8 shadow-lg dark:bg-darker md:w-[650px]">
        <CardHeader className="mb-4">
          <CardTitle className="mb-6 text-4xl font-bold text-primary">
            Contact Us
          </CardTitle>
          <CardDescription>
            Send us a direct message and a member of our team will reach out to
            you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitForm)}
              ref={ref}
              className="space-y-6"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Add your name" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Location */}
              {/* <FormField
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
              /> */}
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter an email address" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-44"
                        placeholder="Add your message here..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;
