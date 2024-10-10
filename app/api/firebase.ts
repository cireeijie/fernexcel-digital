import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";

export const createProduct = async (data: any) => {
  try {
    const timestamp = Timestamp.now();
    const productData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      totalSales: 0,
    };

    const docRef = await addDoc(collection(db, "products"), productData);

    return { status: 200, message: "Product created", id: docRef.id };
  } catch (e) {
    return { status: 500, message: "Something went wrong", error: e };
  }
};

export const getAllProducts = async () => {
  try {
    const productsSnapshot = await getDocs(collection(db, "products"));
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      status: 200,
      products,
    };
  } catch (e) {
    return { status: 500, message: "Something went wrong", error: e };
  }
};

export const getProductById = async (id: string) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    return { status: 200, product: { id: docSnap.id, ...docSnap.data() } };
  } catch (e) {
    return { status: 500, message: "Something went wrong", error: e };
  }
};

export const updateProduct = async (id: string, data: any) => {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, data);
    return { status: 200, message: "Product updated" };
  } catch (e) {
    return { status: 500, message: "Something went wrong", error: e };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, "products", id));
    return { status: 200, message: "Product deleted" };
  } catch (e) {
    return { status: 500, message: "Something went wrong", error: e };
  }
};
