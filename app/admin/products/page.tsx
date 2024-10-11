import { getAllProducts } from "@/app/api/firebase";
import AdminProductTabs from "@/components/admin-product-tabs";

export default async function Products() {
  const data = await getAllProducts();
  const products = data;

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <AdminProductTabs data={products} />
    </main>
  );
}
