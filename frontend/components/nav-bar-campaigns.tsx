"use client";

import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "./breadcrumbs";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function NavBarCompaigns() {
  return (
    <>
      <header className="border-b py-4 px-25">
        <nav className="flex items-center justify-between " aria-label="Campaign Navigation">
          <Link href="/" aria-label="Go to homepage">
            <div className="flex items-center space-x-2">
              <Image
                src="/baig.webp"
                alt="FundBase Logo"
                width={80}
                height={80}
                className="rounded-full"
                priority
              />
              <span className="font-bold text-lg text-green-700">FundBase</span>
            </div>
          </Link>
          <ConnectButton/>
        </nav>
      </header>
    </>
    
  );
}
