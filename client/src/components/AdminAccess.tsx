import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";

interface AdminAccessProps {
  className?: string;
}

export default function AdminAccess({ className }: AdminAccessProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Check if the user is authenticated (e.g., via a cookie or localStorage)
    // This is a placeholder; you may want to replace with your actual auth check
    const email = localStorage.getItem("adminEmail");
    if (email === "jansahagun@gmail.com") {
      setIsAuthenticated(true);
      setUserEmail(email);
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className={cn("text-gray-400 hover:text-white", className)}>
          Admin
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Access</DialogTitle>
        </DialogHeader>
        {isAuthenticated ? (
          <div className="space-y-4">
            <p>You are logged in as admin ({userEmail}).</p>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
} 