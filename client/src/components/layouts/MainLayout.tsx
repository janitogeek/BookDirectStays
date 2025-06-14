import { ReactNode } from "react";
import AdminAccess from "@/components/AdminAccess";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
      <AdminAccess />
    </div>
  );
} 