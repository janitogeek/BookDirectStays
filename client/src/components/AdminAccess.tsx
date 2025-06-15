import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AdminAccessProps {
  className?: string;
}

export default function AdminAccess({ className }: AdminAccessProps) {
  const [isOpen, setIsOpen] = useState(false);

  // BYPASS AUTH FOR DEVELOPMENT
  const isAuthenticated = true;
  const userEmail = "dev@local";

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
          <div>Login required (bypassed in dev)</div>
        )}
      </DialogContent>
    </Dialog>
  );
} 