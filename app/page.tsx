import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <>
      <div className="py-6">
        <h1 className="text-red-500 text-3xl">Home Page</h1>
        <p>Start building your app here!</p>
      </div>
    </>
  );
}
