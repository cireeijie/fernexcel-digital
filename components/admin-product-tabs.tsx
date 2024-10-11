"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  File,
  ImageOff,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { deleteProduct } from "@/app/api/firebase";
import { toast } from "@/hooks/use-toast";
import { ProductType } from "@/types/types";

export default function AdminProductTabs({
  products,
}: {
  products: ProductType[];
}) {
  const [productsList, setProductsList] = useState(products);
  const [activeTab, setActiveTab] = useState<
    "all" | "active" | "draft" | "archived"
  >("all");

  const handleTabChange = (tab: "all" | "active" | "draft" | "archived") => {
    setActiveTab(tab);

    if (!products) return;

    if (tab === "all") {
      setProductsList(products);
    } else {
      setProductsList(
        products.filter((product: ProductType) => product.status === tab)
      );
    }
  };

  const timestampToDate = (timestamp: { seconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
  };

  const handleDelete = async (id: string | undefined, name: string) => {
    if (!id) return;

    const response = await deleteProduct(id);

    if (response.status === 200) {
      setProductsList(
        productsList.filter((product: ProductType) => product.id !== id)
      );
      toast({
        title: `Product "${name}" deleted`,
        description: "The product was deleted successfully.",
      });
    } else {
      toast({
        title: `Something went wrong`,
        description: "An error occurred while deleting the product.",
      });
    }
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all" onClick={() => handleTabChange("all")}>
            All
          </TabsTrigger>
          <TabsTrigger value="active" onClick={() => handleTabChange("active")}>
            Active
          </TabsTrigger>
          <TabsTrigger value="draft" onClick={() => handleTabChange("draft")}>
            Draft
          </TabsTrigger>
          <TabsTrigger
            value="archived"
            className="hidden sm:flex"
            onClick={() => handleTabChange("archived")}
          >
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-7 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Link href="/admin/products/new-product">
            <Button size="sm" className="h-7 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent value={activeTab}>
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage your products and view their sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productsList.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Total Sales
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created at
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsList.map((product: ProductType, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="hidden sm:table-cell">
                        {product.image.src ? (
                          <Image
                            alt={product.image.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={product.image.src}
                            width="64"
                          />
                        ) : (
                          <div className="w-[64px] h-[64px] rounded-md bg-muted/50 flex items-center justify-center">
                            <ImageOff />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {product.stocks[0].salePrice > 0 ? (
                          <>
                            <span>
                              ${product.stocks[0].salePrice.toFixed(2)}
                            </span>
                            <Badge className="ml-2" variant="outline">
                              on sale
                            </Badge>
                          </>
                        ) : (
                          <span>${product.stocks[0].price.toFixed(2)}</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.totalSales}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {timestampToDate(product?.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Link href={`/admin/products/${product.id}`}>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDelete(
                                  product.id || undefined,
                                  product.name
                                )
                              }
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="w-full text-center">No products found</div>
            )}
          </CardContent>
          <CardFooter>
            {productsList.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-{productsList.length}</strong> of{" "}
                <strong>{productsList.length}</strong> products
              </div>
            )}
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
