import React from "react";
import AdminMobileSidebar from "./admin-mobile-sidebar";
import { Input } from "./ui/input";
import UserSettingsDropdown from "./user-settings-dropdown";
import PageBreadcrumbs from "./page-breadcrumbs";
import { Search } from "lucide-react";

export default function PageHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <AdminMobileSidebar />
      <PageBreadcrumbs />
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <UserSettingsDropdown />
    </header>
  );
}
