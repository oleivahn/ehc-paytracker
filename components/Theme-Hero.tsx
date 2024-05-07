import React from "react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="container">
      <div className="pt-15 mt-5 flex flex-col items-center gap-1 rounded-lg bg-ox p-14 py-10 text-center shadow-md md:py-36">
        <h1 className="mb-5 text-5xl font-bold text-ox-foreground">
          Home Page
        </h1>

        <p>Start building your app here!</p>
        <h3 className="mt-10 text-3xl font-semibold text-primary">
          Theme Ready
        </h3>
        <p className="font-semibold text-ox-foreground">
          Add the changes to the global .css file and tailwind.config.ts
        </p>
        <p className="mt-5">
          These colors are <span className="text-ox-foreground">ALREADY</span>{" "}
          custom set for new color variables
        </p>
        <p>Look for the ox and ox-foreground color examples</p>
        <p className="py-4">
          .env ready{" "}
          <span className="text-primary">
            {process.env?.TEST_VAR_2 || ".env file missing here"}
          </span>
        </p>
        <div className="mt-5 flex flex-col gap-5 md:flex-row">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
