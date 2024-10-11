import { z } from "zod";

export const ProductFormSchema = z.object({
  id: z.string().optional(),
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
  totalSales: z.number().optional(),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});
