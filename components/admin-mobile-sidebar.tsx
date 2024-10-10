import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  ShoppingCart,
  Users2,
} from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import Link from "next/link";

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

export default function AdminMobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">FernExcel Digital</span>
          </Link>
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
