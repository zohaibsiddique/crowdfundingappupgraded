"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export default function NavBar() {
  return (
    <header className="border-b py-2 px-25">
      <nav className="flex items-center justify-between mx-auto" aria-label="Main Navigation">
        {/* Logo */}
        <Link href="/" aria-label="Go to homepage">
          <div className="flex items-center space-x-2">
            <Image
              src="/baig.webp"
              alt="FundBase - Community Crowdfunding Logo"
              width={80}
              height={80}
              className="rounded-full"
              priority
            />
            <span className="font-bold text-3xl text-green-700">FundBase</span>
          </div>
        </Link>

        {/* CTA Button */}
        <div className="flex flex-row items-center space-x-4 lg:flex-row-reverse">
          <Button asChild className="text-white ml-4 bg-green-700 hover:bg-green-900">
            <Link href="/campaigns" aria-label="View open fundraising campaigns">
              Fund Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
