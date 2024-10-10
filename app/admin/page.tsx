"use client";

import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Preloader from "@/components/preloader";
export default function Admin() {
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/admin/dashboard");
      } else {
        setTimeout(() => {
          router.push("/sign-in");
        }, 1000);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Preloader />
    </div>
  );
}
