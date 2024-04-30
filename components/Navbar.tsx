"use client"
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import ThemeButton from "./ThemeButton";

//- Daisy UI Navbar component
const Navbar = () => {

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-base-300">
          {/* Hamburger Menu */}
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div> 

          {/* Regular Navbar */}          
          <div className="flex-1 px-2 mx-2 text-xl">
          <div className="w-40 max-w-full px-4">
            <Link href="/" className="block w-full py-5">
              <Image
                src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-white.svg"
                alt="logo"
                // className="hidden hidden dark:block"
                height={150}
                width={150}
              />
            </Link>
          </div>
            <Link href="/">Navbar Title</Link>
          </div>
          
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal gap-2">
              {/* Navbar menu content here */}
              <li className="text-lg"><Link href="/">Home</Link></li>
              <li className="text-lg"><Link href="/contactUs">Contact Us</Link></li>
            </ul>
          </div>

          {/* ThemeButton */}
          <div className="menu menu-horizontal">
            <ThemeButton />
          </div>
        </div>
        {/* Page content here */}
        {/* Content */}
      </div> 

      {/* DRAWER MENU */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label> 
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          {/* Sidebar content here */}
          <li className="text-lg"><Link href="/">Home</Link></li>
          <li className="text-lg"><Link href="/contactUs">Contact Us</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

