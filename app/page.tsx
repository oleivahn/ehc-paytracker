import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="container">
      <div className="bg-ox rounded-lg shadow-md mt-5 py-6 pt-15 p-20">
        <h1 className="text-ox-foreground font-bold text-5xl mb-5">
          Home Page
        </h1>
        <p>Start building your app here!</p>
        <h3 className="text-3xl text-primary font-semibold mt-10">
          Theme Ready
        </h3>
        <p className="text-ox-foreground font-semibold">
          Add the changes to the global .css file and tailwind.config.ts
        </p>
        <p className="mt-5">
          These colors are <span className="text-ox-foreground">ALREADY</span>{" "}
          custom set for new color variables
        </p>
        <p>Look for the ox and ox-foreground color examples</p>
        <div className="flex gap-5 mt-5">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
    </div>
  );
}
