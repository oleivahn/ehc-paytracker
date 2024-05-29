"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

// - This needs to be attached to a form with an action -- not onSubmit
const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" className="h-12 w-full">
      {pending ? "Sending..." : "Send Email"}
    </Button>
  );
};

export default SubmitButton;
