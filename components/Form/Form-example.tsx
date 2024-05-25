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

import SubmitButton from "./SubmitButton";

import { contactFormAction } from "@/app/actions/contactFormAction";

// - Make this a Conform example
//  https://conform.guide/integration/nextjs

const InputForm = () => {
  // - Form Action
  const ref = React.useRef<HTMLFormElement>(null);

  const formAction = async (formData: FormData) => {
    ref.current?.reset();

    const res = await contactFormAction(formData);
    console.log("📗 [ formAction? ]:", res);
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
          <form className="m-4 flex gap-2" ref={ref} action={formAction}>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" placeholder="Name of your project" />
            <label htmlFor="email">Email</label>
            <input id="email" name="email" placeholder="Name of your project" />
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InputForm;
