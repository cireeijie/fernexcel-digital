import type { Metadata } from "next";
// import { Toaster } from "@/components/ui/toaster";
import AdminSidebar from "@/components/admin-sidebar";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Admin dashboard | Fernexcel Digital",
  description: "Admin dashboard page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex gap-5 w-full h-screen">
      <AdminSidebar />
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 bg-muted/40">
          <PageHeader />
          {children}
        </div>
      </div>
    </div>
  );
}
