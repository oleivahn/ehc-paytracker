import Image from "next/image";
import ContactUs from "./contactUs/page";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <p className="text-blue-600">Dances 4 u</p>
    <Link href="/contactUs">Contact Us</Link>
    </>
  );
}
