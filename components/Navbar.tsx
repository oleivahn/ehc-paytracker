"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { siteConfig } from "@/config/site";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThemeToggle } from "./Theme-toggle";

import { Icons } from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
  protected: boolean;
};

export default function Navbar() {
  // - How to set colors for active links
  // https://stackoverflow.com/questions/68978743/tailwindcss-active-link-text-color-not-changing
  const pathname = usePathname();
  // const user = await currentUser();

  const LEFT_NAV_ITEMS: NavItem[] = [
    { href: "/", label: "Home", protected: false },
    { href: "/dashboard", label: "Dashboard", protected: true },
  ];

  const RIGHT_NAV_ITEMS: NavItem[] = [
    { href: "/new_employee", label: "New Employee", protected: false },
    { href: "/new_day", label: "New Day", protected: false },
  ];

  return (
    <div className="flex w-full flex-col border-b">
      <header className="container sticky top-0 flex h-20 items-center gap-4 bg-background px-4 md:px-6">
        {/* DRAWER */}
        {/* HOW TO CLOSE THE DRAWER AFTER CLICKING ON A LINK */}
        {/* https://github.com/saadeghi/daisyui/discussions/2444 */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              {[...LEFT_NAV_ITEMS, ...RIGHT_NAV_ITEMS].map(
                ({ href, label }, i) => {
                  const isActive = pathname === href;

                  return (
                    <Link
                      key={i}
                      href={href}
                      onClick={() => {
                        document.getElementById("close-drawer")?.click();
                      }}
                      className={`${
                        isActive ? "text-primary" : "text-muted-foreground"
                      } transition-colors hover:text-foreground text-nowrap`}
                    >
                      {label}
                    </Link>
                  );
                }
              )}
            </nav>
          </SheetContent>
        </Sheet>
        {/* LOGO AND LEFT SIDE MENUS */}
        <nav className="ie md:text-md flex-col gap-6 text-lg md:flex md:flex-row md:items-center md:gap-5 lg:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="inline-block text-nowrap text-xl font-bold md:text-3xl">
              {siteConfig.name}
            </span>
          </Link>
          {LEFT_NAV_ITEMS.map(({ href, label }, i) => {
            const isActive = pathname === href;

            return (
              <Link
                key={i}
                href={href}
                className={`${
                  isActive ? "text-primary" : "text-muted-foreground"
                } transition-colors hover:text-foreground text-nowrap hidden md:block font-semibold`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SIDE MENUS */}
        <div className="ml-auto flex items-center gap-4 text-lg md:gap-2 lg:gap-10">
          {RIGHT_NAV_ITEMS.map(({ href, label }, i) => {
            // console.log("📗 LOG [ href ]:", href, label, i);
            const isActive = pathname === href;

            return (
              <Link
                key={i}
                href={href}
                className={`${
                  isActive ? "text-primary" : "text-muted-foreground"
                } transition-colors hover:text-foreground text-nowrap hidden md:block font-semibold`}
              >
                {label}
              </Link>
            );
          })}
          <ThemeToggle />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-background">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
        {/* </div> */}
      </header>
    </div>
  );
}
