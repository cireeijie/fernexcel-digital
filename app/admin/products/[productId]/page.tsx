"use client";

import Image from "next/image";
import { storage } from "@/app/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ChevronLeft, CircleMinus, PlusCircle, Upload } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Textarea } from "@/components/ui/textarea";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const FormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  category: z.string(),
  stocks: z.array(
    z.object({
      sku: z.string(),
      stock: z.coerce.number(),
      price: z.coerce.number(),
      salePrice: z.coerce.number(),
      variantName: z.string(),
      //   variantType: z.string(),
    })
  ),
  image: z.object({
    name: z.string(),
    src: z.string(),
  }),
  status: z.string(),
});

const defaultValues = {
  name: "",
  description: "",
  category: "",
  stocks: [
    {
      sku: "",
      stock: 0,
      price: 0,
      salePrice: 0,
      variantName: "",
      //   variantType: "",
    },
  ],
  image: {
    name: "",
    src: "",
  },
  status: "draft",
};

export default function Product() {
  const pathname = usePathname();

  const [isNewProduct, setIsNewProduct] = useState(false);
  const [productValues, setProductValues] = useState({
    name: "Test product",
    description: "test",
    category: "",
    stocks: [
      {
        sku: "",
        stock: 100,
        price: 70,
        salePrice: 60,
        variantName: "Test variant",
        // variantType: "",
      },
    ],
    image: {
      name: "",
      src: "",
    },
    status: "draft",
  });

  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(
    productValues?.image?.src
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: productValues || defaultValues,
    mode: "onChange",
  });

  const {
    fields: stockFields,
    remove: removeStock,
    append: appendStock,
  } = useFieldArray({
    name: "stocks",
    control: form.control,
  });

  useMemo(() => stockFields.map((i) => i.id), [stockFields]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = async (e: any) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);

    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `images/${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setUploadedUrl(url);
      console.log("File uploaded successfully");
    } catch (error) {
      console.log("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddStock = (e: any) => {
    e.preventDefault();
    const existingSKUs = new Set();

    const generateRandomChar = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      return chars.charAt(Math.floor(Math.random() * chars.length));
    };

    const generateUniqueSKU = () => {
      let uniqueSKU;
      do {
        // Generate the SKU in the format FED-XXX-XXX
        const skuPart1 =
          generateRandomChar() + generateRandomChar() + generateRandomChar();
        const skuPart2 =
          generateRandomChar() + generateRandomChar() + generateRandomChar();
        uniqueSKU = `FED-${skuPart1}-${skuPart2}`;
      } while (existingSKUs.has(uniqueSKU)); // Check for uniqueness

      existingSKUs.add(uniqueSKU); // Store the new SKU
      return uniqueSKU; // Return the unique SKU
    };

    const uniqueSKU = generateUniqueSKU();

    appendStock({
      sku: uniqueSKU,
      stock: 0,
      price: 0,
      salePrice: 0,
      variantName: "",
      //   variantType: "",
    });
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  useEffect(() => {
    if (pathname.includes("new-product")) {
      setIsNewProduct(true);
    }
  }, [pathname]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/products">
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {isNewProduct ? "New Product" : "Product Details"}
              </h1>
              {!isNewProduct && (
                <Badge variant="outline" className="ml-auto sm:ml-0">
                  In stock
                </Badge>
              )}
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <Button size="sm">Save Product</Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>
                      Product name and a brief description to provide key
                      information at a glance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="grid gap-3">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Product name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="grid gap-3">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Product description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-1">
                  <CardHeader>
                    <CardTitle>Stock</CardTitle>
                    <CardDescription>
                      An overview of available product variants and their
                      corresponding prices, helping you easily choose the right
                      option.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">SKU</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Sale Price</TableHead>
                          <TableHead>Variant</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stockFields?.map((stock, index) => (
                          <TableRow key={stock.id}>
                            <TableCell className="font-semibold">
                              {stock.sku}
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`stocks.${index}.stock`}
                                render={({ field }) => (
                                  <FormItem className="grid gap-3">
                                    <FormLabel className="sr-only">
                                      Stock
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        className="!mt-0"
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`stocks.${index}.price`}
                                render={({ field }) => (
                                  <FormItem className="grid gap-3">
                                    <FormLabel className="sr-only">
                                      Stock
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        className="!mt-0"
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`stocks.${index}.salePrice`}
                                render={({ field }) => (
                                  <FormItem className="grid gap-3">
                                    <FormLabel className="sr-only">
                                      Stock
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        className="!mt-0"
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`stocks.${index}.variantName`}
                                render={({ field }) => (
                                  <FormItem className="grid gap-3">
                                    <FormLabel className="sr-only">
                                      Stock
                                    </FormLabel>
                                    <FormControl>
                                      <Input className="!mt-0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                className="bg-transparent text-red-500 shadow-none p-0 opacity-50 hover:bg-transparent hover:opacity-100"
                                onClick={() => removeStock(index)}
                              >
                                <CircleMinus />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="justify-center border-t p-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1"
                      onClick={(e) => handleAddStock(e)}
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add Variant
                    </Button>
                  </CardFooter>
                </Card>
                <Card x-chunk="dashboard-07-chunk-2">
                  <CardHeader>
                    <CardTitle>Product Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-3">
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger
                                  id="category"
                                  aria-label="Select category"
                                >
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Digital Product">
                                    Digital Product
                                  </SelectItem>
                                  <SelectItem value="Clothing">
                                    Clothing
                                  </SelectItem>
                                  <SelectItem value="Electronics">
                                    Electronics
                                  </SelectItem>
                                  <SelectItem value="Accessories">
                                    Accessories
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        ></FormField>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Product Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="status">Status</Label>
                        <Select>
                          <SelectTrigger id="status" aria-label="Select status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="overflow-hidden"
                  x-chunk="dashboard-07-chunk-4"
                >
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>
                      Showcases high-quality visuals of the product, giving you
                      a clear view of its appearance from different angles.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {uploadedUrl ? (
                        <Image
                          alt="Product image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="300"
                          src={productValues.image.src}
                          width="300"
                        />
                      ) : (
                        <div className="relative">
                          <Input
                            type="file"
                            className="absolute h-full cursor-pointer opacity-0"
                            onChange={handleUpload}
                          />
                          <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Upload</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-5">
                  <CardHeader>
                    <CardTitle>Archive Product</CardTitle>
                    <CardDescription>
                      Temporarily remove a product from active listings while
                      keeping it accessible for future reference.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div></div>
                    <Button size="sm" variant="secondary">
                      Archive Product
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">Save Product</Button>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
