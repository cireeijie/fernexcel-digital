"use client";

import { ProductType } from "@/types/types";
import React from "react";
import ProductCard from "./ui/product-card";
import { Card } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";

export default function ProductListing({ data }: { data: ProductType[] }) {
  return (
    <div
      className={`max-w-7xl w-full mx-auto gap-6 z-10 grid grid-cols-1 sm:grid-cols-4 `}
    >
      {data.length > 0 ? (
        data.map((product: ProductType) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products found</p>
      )}
      <Card className="w-full sm:max-w-xs rounded-xl border width bg-primary">
        <div className="flex flex-col px-4 py-8 h-full items-center justify-center">
          <h2 className="text-2xl font-bold text-white text-center">
            Looking for something special? Let&apos;s customize it for you!
          </h2>
          <p className="text-center text-white font-light mb-6">
            First users get a delightful discount!
          </p>
          <Link href="https://discord.gg/zBmbKJq3" target="_blank">
            <Button variant="secondary" className="w-full" size="lg">
              Get a quote
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
