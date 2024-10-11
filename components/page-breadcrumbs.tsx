"use client";

import React, { useEffect, useState } from "react";
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
import { useParams } from "next/navigation";
import { getProductById } from "@/app/api/firebase";
import { ProductType } from "@/types/types";

export default function PageBreadcrumbs() {
  const [currentPageName, setCurrentPageName] = useState<string | null>(null);
  const pathname = usePathname();
  const pathnames = pathname.split("/");
  pathnames.shift();

  const params = useParams();
  const { productId } = params;

  useEffect(() => {
    const getProductName = async (id: string) => {
      const data = await getProductById(id);
      const productData: ProductType | null | undefined = data.product;

      if (data.status === 200) {
        if (productData) {
          setCurrentPageName(productData.name);
        } else {
          setCurrentPageName(null);
        }
      } else {
        setCurrentPageName(null);
      }

      return null;
    };

    if (productId && typeof productId === "string") {
      getProductName(productId);
    } else {
      setCurrentPageName(null);
    }
  }, [currentPageName, productId]);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {pathnames.length > 0 &&
          pathnames.map((path, index) => (
            <React.Fragment key={index}>
              {index === pathnames.length - 1 ? (
                <BreadcrumbItem className="capitalize">
                  <BreadcrumbPage>
                    {currentPageName ? currentPageName : path.replace("-", " ")}
                  </BreadcrumbPage>
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
