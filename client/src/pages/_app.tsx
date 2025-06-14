import type { AppProps } from "next/app";
import MainLayout from "@/components/layouts/MainLayout";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Component {...pageProps} />
      <Toaster />
    </MainLayout>
  );
} 