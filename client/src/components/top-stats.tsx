import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface TopStatsProps {
  topStats: string;
  brandName: string;
  onOpenChange?: (open: boolean) => void;
}

export default function TopStats({ topStats, brandName, onOpenChange }: TopStatsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Don't render if no stats provided
  if (!topStats || !topStats.trim()) {
    return null;
  }

  const stats = topStats.trim();

  // Handle popover open/close state changes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      {/* Header with Toggle Button */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          📊 Stats Provided by the Host
        </h4>
        
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
            >
              {isOpen ? "Hide" : "Show"}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-80 max-w-[calc(100vw-2rem)] p-0 border-0 shadow-xl"
            side="top"
            align="end"
            sideOffset={8}
          >
            {/* Chat bubble design */}
            <div className="relative bg-white rounded-lg border border-gray-200 shadow-lg">
              {/* Chat bubble pointer */}
              <div className="absolute -bottom-2 right-4 sm:right-6 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
              
              {/* Content */}
              <div className="p-3 sm:p-4">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <h4 className="text-sm font-semibold text-gray-800 truncate">
                    📊 {brandName} Stats
                  </h4>
                </div>
                
                {/* Stats content */}
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line max-h-48 sm:max-h-64 overflow-y-auto">
                  {stats}
                </div>
                
                {/* Disclaimer */}
                <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100 italic">
                  This information was provided by the host and is not verified by BookDirectStays.
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
} 