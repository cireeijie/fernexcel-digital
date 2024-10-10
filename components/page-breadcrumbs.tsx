"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PageBreadcrumbs() {
  const pathname = usePathname();
  const pathnames = pathname.split("/");
  pathnames.shift();

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {pathnames.length > 0 &&
          pathnames.map((path, index) => (
            <React.Fragment key={index}>
              {index === pathnames.length - 1 ? (
                <BreadcrumbItem className="capitalize">
                  <BreadcrumbPage>{path.replace("-", " ")}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem className="capitalize">
                  <BreadcrumbLink asChild>
                    <Link href={`/${pathnames.slice(0, index + 1).join("/")}`}>
                      {path.replace("-", " ")}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}

              {index < pathnames.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
