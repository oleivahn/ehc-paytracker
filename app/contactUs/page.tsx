"use client";

import * as React from "react";

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
import Link from "next/link";
import { useFormState } from "react-dom";

import { contactFormAction } from "@/app/actions/contactFormAction";

export default function ContactUs() {
  // - Easy way to handle form state with Server Actions
  // Example 1: This FormData is a built-in browser API, not one I defined
  // CANT USE ASYNC ON THIS ONE
  // function formAction(formData: FormData) {
  //   console.log("📗 LOG [ formData ]:", formData.get("name"));
  //   // TODO: Connect the right form and send the data to mongodb
  //   handleContactForm(formData);
  // }

  const formAction = (formData: FormData) => {
    // TODO: Connect the right form and send the data to mongodb
    const results = contactFormAction(formData);
    console.log("📗 LOG [ results ]:", results);
  };

  // Example 2: Harder way - This is an example of a form submission in React using the onSubmit event handler
  // async function formSubmit(event: React.FormEvent<HTMLFormElement>) {
  //   event.preventDefault(); // Prevent the form from submitting normally

  //   console.log("WE ARE HERE");
  //   const formData = new FormData(event.currentTarget); // Create a FormData instance from the form
  //   handleContactForm(formData);
  // }

  return (
    <div className="mt-10 flex flex-col items-center px-4">
      <form
        action={formAction}
        // onSubmit={formSubmit}
      >
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name of your project" />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Name of your project" />
        {/* <label htmlFor="framework">Framework</label>
        <select id="framework">
          <option value="next">Next.js</option>
          <option value="sveltekit">SvelteKit</option>
          <option value="astro">Astro</option>
          <option value="nuxt">Nuxt.js</option>
        </select> */}
        <button type="submit">Deploy</button>
      </form>
      <Card className="w-full shadow-lg dark:bg-darker md:w-[650px]">
        <CardHeader>
          <CardTitle>Contact EHC</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: Implement the actual shadcn form here */}
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Name of your project"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Framework</Label>
                <Select>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="sveltekit">SvelteKit</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                    <SelectItem value="nuxt">Nuxt.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          {/* <Link href="/"> */}
          <Button type="submit">Deploy</Button>
          {/* </Link> */}
        </CardFooter>
      </Card>
    </div>
  );
}
