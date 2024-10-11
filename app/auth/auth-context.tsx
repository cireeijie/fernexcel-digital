import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/app/firebase/config"; // Import Firebase's User
import { User } from "firebase/auth";
import Preloader from "@/components/preloader";

interface AuthContextProps {
  user: User | null; // Update the type to include both User and null
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (pathname.includes("admin")) {
        if (user) {
          setUser(user);
          setLoading(false);
          router.push(pathname);
        } else {
          setUser(null);
          setTimeout(() => {
            router.push("/sign-in");
          }, 1000);
        }
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="fixed z-50 top-0 left-0 h-screen w-full flex justify-center items-center">
        <Preloader />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
