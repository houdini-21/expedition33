"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { http } from "@/api/http";
import { routes } from "@/api/routes";

type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
};

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refetchUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const {
        data: { user: fetchedUser },
      } = await http<ApiResponse<{ user: User }>>(routes.auth.me);
      console.log("Fetched user:", fetchedUser);
      setUser(fetchedUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = async () => {
    try {
      setUser(null);
      await http(routes.auth.logout, { method: "GET" });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, logout, refetchUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
