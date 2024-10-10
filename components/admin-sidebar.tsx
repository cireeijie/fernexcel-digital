/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import {
  Package,
  Package2,
  Home,
  ShoppingCart,
  Users2,
  LineChart,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/app/firebase/config";
import { signOut } from "firebase/auth";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const menu = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <Home size={20} />,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: <ShoppingCart size={20} />,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: <Package size={20} />,
  },
  {
    name: "Customers",
    path: "/admin/customers",
    icon: <Users2 size={20} />,
  },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: <LineChart size={20} />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">FernExcel Digital</span>
        </Link>
        {menu.map((item) => (
          <TooltipProvider key={item.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.path}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    pathname.includes(item.path)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.icon}
                  <span className="sr-only">{item.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
