"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const userSettings = [
  {
    name: "Settings",
    href: "#",
    action: () => {},
  },
  {
    name: "Support",
    href: "#",
    action: () => {},
  },
  {
    name: "Logout",
    href: "#",
    action: () => signOut(auth),
  },
];

export default function UserSettingsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar className="hidden h-9 w-9 sm:flex overflow-hidden rounded-full">
            <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
            <AvatarFallback>FE</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userSettings.map((item) => (
          <DropdownMenuItem
            key={item.name}
            className="cursor-pointer"
            onClick={item.action}
          >
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
