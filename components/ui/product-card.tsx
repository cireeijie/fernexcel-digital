"use client";

import { ProductType } from "@/types/types";
import Image from "next/image";
import React, { useState } from "react";
import { Card } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";

export default function ProductCard({ product }: { product: ProductType }) {
  const [selectedVariant, setSelectedVariant] = useState(product.stocks[0]);

  const handleVariantChange = (sku: string) => {
    const variant = product.stocks.find((stock) => stock.sku === sku);
    if (variant) setSelectedVariant(variant);

    console.log(variant);
  };

  return (
    <Card className="w-full sm:max-w-xs rounded-xl border width">
      <div className="grid gap-4 p-4">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border">
          <Image
            src={product.image.src}
            alt={product.image.name}
            width="400"
            height="500"
            className="aspect-[4/5] object-cover w-full"
          />
        </div>
        <div className="grid gap-1.5">
          <h3 className="font-semibold text-sm md:text-base">{product.name}</h3>
          <div className="flex gap-1 flex-wrap">
            {product.stocks.length > 0 ? (
              product.stocks.map((stock) => (
                <Badge
                  key={stock.sku}
                  variant={
                    selectedVariant.sku === stock.sku ? "default" : "outline"
                  }
                  onClick={() => handleVariantChange(stock.sku)}
                  className="cursor-pointer"
                >
                  {stock.variantName}
                </Badge>
              ))
            ) : (
              <Badge>Out of Stock</Badge>
            )}
          </div>

          {selectedVariant && (
            <div className="mt-2">
              {selectedVariant.salePrice > 0 ? (
                <div className="flex gap-2">
                  <p className="font-semibold text-sm md:text-base">
                    ${selectedVariant.salePrice.toFixed(2)}
                  </p>
                  <s className="text-sm md:text-base">
                    ${selectedVariant.price.toFixed(2)}
                  </s>
                  <Badge variant="destructive">Sale</Badge>
                </div>
              ) : (
                <p className="font-semibold text-sm md:text-base">
                  ${selectedVariant.price.toFixed(2)}
                </p>
              )}
            </div>
          )}

          <p className="text-sm md:text-base text-muted-foreground">
            {product.description}
          </p>
        </div>
        <Button size="sm">Get a quote</Button>
      </div>
    </Card>
  );
}
