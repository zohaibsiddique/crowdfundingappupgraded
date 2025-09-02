// components/FooterSection.tsx

import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="relative bg-black text-white pt-20 overflow-hidden">
      {/* Blue Diagonal Top Border */}
      <div className="absolute top-0 left-0 w-full h-25 bg-blue-500 -skew-y-3 -translate-y-1/2" />

      <div className="relative z-10 pt-5  mx-auto px-45 grid grid-cols-1  md:grid-cols-[3fr_1fr_1fr_1fr] gap-10">
        {/* FundBase Brand & Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            
            <h2 className="text-2xl font-semibold">FundBase</h2>
          </div>
          <p className="text-sm text-gray-300">
            FundBase is a crowdfunding platform dedicated to empowering projects and startups. With transparent funding goals and secure transactions, FundBase helps bring innovative ideas to life.
          </p>

          <div className="text-sm text-gray-400 space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> +1 23 456 789
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> support@fundbase.mail
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> 123 Fund Lane, NY, USA
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li> 
              <Link href="/campaigns" aria-label="View open fundraising campaigns">
                Campaigns
              </Link>
            </li>
          </ul>
        </div>

        {/* FAQs */}
        <div>
          <h3 className="text-lg font-semibold mb-3">FAQs</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>
               <Link href="#faq" aria-label="View open fundraising campaigns">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-white text-xl">
            <Facebook className="hover:text-blue-500 cursor-pointer" />
            <Twitter className="hover:text-blue-500 cursor-pointer" />
            <Instagram className="hover:text-blue-500 cursor-pointer" />
            <Mail className="hover:text-blue-500 cursor-pointer" />
            <Youtube className="hover:text-blue-500 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        © 2025 FUNDBASE. All Rights Reserved.
      </div>
    </footer>
  );
}
