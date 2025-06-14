import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";

export default function AdminApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      
      if (!token && router.pathname !== "/admin/login") {
        router.push("/admin/login");
        return;
      }

      if (token) {
        try {
          const response = await fetch("/api/admin/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            localStorage.removeItem("adminToken");
            router.push("/admin/login");
            return;
          }

          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem("adminToken");
          router.push("/admin/login");
          return;
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (router.pathname === "/admin/login") {
    return <Component {...pageProps} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <Component {...pageProps} />
    </AdminLayout>
  );
} 