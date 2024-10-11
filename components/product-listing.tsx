"use client";

import { ProductType } from "@/types/types";
import React from "react";
import ProductCard from "./ui/product-card";

export default function ProductListing({ data }: { data: ProductType[] }) {
  return (
    <div
      className={`max-w-7xl w-full mx-auto gap-6 z-10 grid grid-cols-1 sm:grid-cols-4 px-6`}
    >
      {data.length > 0 ? (
        data.map((product: ProductType) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
}
