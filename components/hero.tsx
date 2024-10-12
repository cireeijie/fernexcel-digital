import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Hero({
  bgImage,
  title,
  subtitle,
  buttonText,
  buttonLink,
}: {
  bgImage: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}) {
  return (
    <div
      className={`w-full bg-cover bg-left bg-no-repeat h-screen flex items-center px-6`}
      style={{ backgroundImage: `url(/images/${bgImage})` }}
    >
      <div className={`max-w-7xl w-full mx-auto gap-5 z-10`}>
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl sm:text-6xl text-zinc-950 drop-shadow-2xl font-bold mb-5">
            {title}
          </h1>
          <p className="text-zinc-950 drop-shadow-sm max-w-[500px]">
            {subtitle}
          </p>
        </div>
        <div className="mt-5">
          <Button asChild>
            <Link href={buttonLink}>{buttonText}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
