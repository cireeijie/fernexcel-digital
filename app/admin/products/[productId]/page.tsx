import { getProductById } from "@/app/api/firebase";
import AdminProductForm from "@/components/admin-product-form";

export default async function Product({ params }: any) {
  const data = await getProductById(params.productId);
  const product = data.product;

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
      <AdminProductForm product={product} />
    </main>
  );
}
