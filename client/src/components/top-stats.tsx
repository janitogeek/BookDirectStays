import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TopStatsProps {
  topStats: string;
  maxLength?: number;
}

export default function TopStats({ topStats, maxLength = 180 }: TopStatsProps) {
  // Don't render if no stats provided
  if (!topStats || !topStats.trim()) {
    return null;
  }

  const stats = topStats.trim();

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      {/* Header with Click to Expand Button */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          📊 Stats Provided by the Host
        </h4>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                📊 Host Stats
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {stats}
              </div>
              <div className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-200 italic">
                This information was provided by the host and is not verified by BookDirectStays.
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 