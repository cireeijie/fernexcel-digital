import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { ProductType } from "@/types/types";
import Error from "next/error";

export const createProduct = async (
  data: ProductType
): Promise<{ status: number; message: string; id?: string; error?: Error }> => {
  try {
    const productData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      totalSales: 0,
    };

    const docRef = await addDoc(collection(db, "products"), productData);

    return { status: 200, message: "Product created", id: docRef.id };
  } catch (e) {
    return { status: 500, message: "Something went wrong", error: e as Error };
  }
};

export const getAllProducts = async (): Promise<{
  status: number;
  products?: ProductType[];
  message: string;
  error?: Error;
}> => {
  try {
    const productsSnapshot = await getDocs(collection(db, "products"));

    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      status: 200,
      products: products as ProductType[],
      message: "Products fetched",
    };
  } catch (e) {
    return { status: 500, message: "Something went wrong", error: e as Error };
  }
};

export const getProductById = async (
  id: string
): Promise<{
  status: number;
  product?: ProductType;
  message?: string;
  error?: Error;
}> => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { status: 404, message: "Product not found" };
    }

    const productData = docSnap.data() as ProductType;

    return { status: 200, product: { id: docSnap.id, ...productData } };
  } catch (e) {
    return { status: 500, message: "Something went wrong", error: e as Error };
  }
};

export const updateProduct = async (
  id: string | undefined,
  data: ProductType
): Promise<{
  status: number;
  message: string;
  error?: Error;
  id?: string | undefined;
}> => {
  if (!id) return { status: 500, message: "Something went wrong" };

  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, data);
    return { status: 200, message: "Product updated" };
  } catch (e) {
    return { status: 500, message: "Something went wrong", error: e as Error };
  }
};

export const deleteProduct = async (
  id: string
): Promise<{ status: number; message: string; error?: Error }> => {
  try {
    await deleteDoc(doc(db, "products", id));
    return { status: 200, message: "Product deleted" };
  } catch (e) {
    return { status: 500, message: "Something went wrong", error: e as Error };
  }
};
