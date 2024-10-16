"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { auth, storage } from "@/app/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  ChevronLeft,
  CircleMinus,
  ImageUp,
  PlusCircle,
  Upload,
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
import { Input } from "@/components/ui/input";
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
import { useFieldArray, useForm } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
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
import Preloader from "@/components/preloader";
import { createProduct, updateProduct } from "@/app/api/firebase";
import { ProductType } from "@/types/types";
import { ProductFormSchema } from "@/schemas/schemas";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminProductForm({
  product,
  formType,
}: {
  product: ProductType | undefined;
  formType: "CREATE" | "UPDATE";
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(
    product?.image?.src
  );
  const [updateImage, setUpdateImage] = useState(false);

  const form = useForm<ProductType>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      id: product?.id || "",
      name: product?.name || "",
      description: product?.description || "",
      category: product?.category || "",
      stocks: product?.stocks || [],
      image: product?.image || {
        name: "",
        src: "",
      },
      status: product?.status || "",
      totalSales: product?.totalSales || 0,
    },
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

    if (!e.target.files[0]) return;

    setUploading(true);
    const storageRef = ref(storage, `images/${e.target.files[0].name}`);

    try {
      await uploadBytes(storageRef, e.target.files[0]);
      const url = await getDownloadURL(storageRef);
      setUploadedUrl(url);
      toast({
        title: "File uploaded successfully",
        description: "Your file has been uploaded successfully.",
      });
      console.log("File uploaded successfully");
    } catch (error) {
      toast({
        title: "Error uploading file",
        description: "Please try again.",
        variant: "destructive",
      });
      console.log("Error uploading file:", error);
    } finally {
      setUploading(false);
      setUpdateImage(false);
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

  const createForm = async (data: ProductType) => {
    try {
      const response = await createProduct(data);

      if (response.status === 200) {
        toast({
          title: "Product created",
          description: "The product was created successfully.",
        });

        router.push(`/admin/products/${response.id}`);
      } else {
        toast({
          title: "Something went wrong",
          description: "An error occurred while creating the product.",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast({
        title: "Server error",
        description: e.message,
      });
    }
  };

  const updateForm = async (data: ProductType) => {
    try {
      const response = await updateProduct(data.id || undefined, data);

      if (response.status === 200) {
        toast({
          title: "Product updated",
          description: "The product was updated successfully.",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "An error occurred while updating the product.",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast({
        title: "Server error",
        description: e.message,
      });
    }
  };

  async function onSubmit(data: ProductType) {
    setLoading(true);

    data.image.name = file?.name || "";
    data.image.src = uploadedUrl || "";

    if (formType === "CREATE") {
      await createForm(data);
    } else {
      await updateForm(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoading(false);
        router.push(pathname);
      } else {
        setTimeout(() => {
          router.push("/sign-in");
        }, 1000);
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="fixed z-50 top-0 left-0 h-screen w-full flex justify-center items-center">
        <Preloader />
      </div>
    );
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/products">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {formType === "CREATE" ? "New Product" : product?.name}
              </h1>
              {!formType && (
                <Badge variant="outline" className="ml-auto sm:ml-0">
                  {product?.status}
                </Badge>
              )}
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Link href="/admin/products">
                  <Button variant="outline" size="sm" disabled={loading}>
                    {formType === "CREATE" ? "Discard" : "Cancel"}
                  </Button>
                </Link>
                <Button size="sm">
                  {loading
                    ? formType === "CREATE"
                      ? "Creating..."
                      : "Updating"
                    : formType === "CREATE"
                    ? "Create Product"
                    : "Update"}
                </Button>
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
                        />
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
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
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
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="archived">
                                    Archived
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="overflow-hidden"
                  x-chunk="dashboard-07-chunk-4"
                >
                  <CardHeader>
                    <CardTitle>Featured Image</CardTitle>
                    <CardDescription>
                      Showcases high-quality visuals of the product, giving you
                      a clear view of its appearance from different angles.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 relative">
                      {uploading && (
                        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center bg-black/30">
                          <Preloader />
                        </div>
                      )}
                      {uploadedUrl && !updateImage ? (
                        <div className={`${uploading ? "opacity-0" : ""}`}>
                          <Image
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="300"
                            src={uploadedUrl}
                            width="300"
                          />
                          <Button
                            className="flex items-center gap-2 w-full mt-3"
                            onClick={(e) => {
                              e.preventDefault();
                              setUpdateImage(true);
                            }}
                          >
                            <ImageUp size={20} />
                            <span>Update Image</span>
                          </Button>
                        </div>
                      ) : (
                        <div
                          className={`${uploading ? "opacity-0" : ""} relative`}
                        >
                          <Input
                            type="file"
                            className="absolute h-full cursor-pointer opacity-0"
                            onChange={handleUpload}
                            disabled={uploading}
                          />
                          <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Upload</span>
                          </button>
                        </div>
                      )}
                      {updateImage && (
                        <Button
                          className={`${uploading ? "opacity-0" : ""} mt-1`}
                          variant="destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            setUpdateImage(false);
                          }}
                        >
                          Cancel
                        </Button>
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
