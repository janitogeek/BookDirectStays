import { useLocation } from "wouter";

interface AdminAccessProps {
  className?: string;
}

export default function AdminAccess({ className }: AdminAccessProps) {
  const [, setLocation] = useLocation();
  return (
    <button
      className={className || "text-gray-400 hover:text-white"}
      onClick={() => setLocation("/admin")}
    >
      Admin
    </button>
  );
} 