import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TopStatsProps {
  topStats: string;
  maxLength?: number;
}

export default function TopStats({ topStats, maxLength = 180 }: TopStatsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if no stats provided
  if (!topStats || !topStats.trim()) {
    return null;
  }

  const stats = topStats.trim();
  const shouldTruncate = stats.length > maxLength;
  const displayText = shouldTruncate && !isExpanded 
    ? stats.slice(0, maxLength).trim() + "..."
    : stats;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      {/* Header - Always visible */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          📊 Stats Provided by the Host
        </h4>
        <span className="text-xs text-gray-500">(Click to expand)</span>
      </div>

      {/* Stats Content */}
      <div className="text-sm text-gray-700 leading-relaxed mb-3">
        {displayText}
      </div>

      {/* Toggle Button - Only show if content is long enough to truncate */}
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              View more
            </>
          )}
        </button>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200 italic">
        This information was provided by the host and is not verified by BookDirectStays.
      </div>
    </div>
  );
} 