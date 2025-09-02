import { useState } from "react";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Nav() {
  const [active, setActive] = useState("Home");

  const navItems = ["Intro", "About", "Pricing", "Contact"];

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <NavigationMenu>
          <NavigationMenuList className="md:flex gap-6">
            {navItems.map((item) => (
              <NavigationMenuItem key={item}>
                <NavigationMenuLink
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setActive(item)}
                  className={`px-4 py-2 rounded-md cursor-pointer ${
                    active === item
                      ? "font-bold underline"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {item}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="text-blue-600">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 mt-10">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={() => setActive(item)}
                  className={`text-lg font-medium px-4 py-2 rounded-md ${
                    active === item
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
