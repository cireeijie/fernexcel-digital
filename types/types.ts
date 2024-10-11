import { ProductFormSchema } from "@/schemas/schemas";
import { z } from "zod";

export type ProductType = z.infer<typeof ProductFormSchema>;
