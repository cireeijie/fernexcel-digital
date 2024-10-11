import ProductListing from "@/components/product-listing";
import React from "react";
import { getAllProducts } from "../api/firebase";

export default async function Products() {
  const data = await getAllProducts();
  const products = data.products || [];

  return (
    <main>
      <div className="max-w-7xl w-full mx-auto gap-5 z-10">
        <div className="text-center py-20">
          <h1 className="text-5xl font-bold mb-2">
            Discover Our Exclusive Products
          </h1>
          <p>Quality and Innovation Designed Just for You</p>
        </div>
        <ProductListing data={products} />
      </div>
    </main>
  );
}
