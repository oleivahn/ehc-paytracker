"use client";

import React from "react";

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

import { contactFormAction } from "@/app/actions/contactFormAction";
import SubmitButton from "./SubmitButton";

const Form = () => {
  const ref = React.useRef<HTMLFormElement>(null);

  const formAction = async (formData: FormData) => {
    ref.current?.reset();

    const res = await contactFormAction(formData);
    console.log("📗 [ formAction? ]:", res);
  };

  return (
    <div className="mt-10 flex flex-col items-center px-4">
      <form
        ref={ref}
        action={formAction}
        // action={formAction}
        // onSubmit={formSubmit}
      >
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name of your project" />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Name of your project" />
        <SubmitButton />
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
};

export default Form;
