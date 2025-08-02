import React, { useState, useEffect, useRef } from 'react';

interface BudgetRangeSliderProps {
  minValue?: number;
  maxValue?: number;
  onRangeChange: (min: number | null, max: number | null) => void;
  className?: string;
}

export default function BudgetRangeSlider({ 
  minValue = null, 
  maxValue = null, 
  onRangeChange,
  className = ""
}: BudgetRangeSliderProps) {
  const [minPrice, setMinPrice] = useState(minValue || 20);
  const [maxPrice, setMaxPrice] = useState(maxValue || 300);
  
  const minSliderRef = useRef<HTMLInputElement>(null);
  const maxSliderRef = useRef<HTMLInputElement>(null);
  
  const MIN_RANGE = 20;
  const MAX_RANGE = 300;
  const GAP = 10; // Minimum gap between sliders

  // Histogram data (simulated distribution)
  const histogramData = [
    { range: 20, height: 15 },
    { range: 30, height: 25 },
    { range: 40, height: 35 },
    { range: 50, height: 45 },
    { range: 60, height: 55 },
    { range: 70, height: 65 },
    { range: 80, height: 70 },
    { range: 90, height: 75 },
    { range: 100, height: 80 },
    { range: 110, height: 75 },
    { range: 120, height: 70 },
    { range: 130, height: 65 },
    { range: 140, height: 60 },
    { range: 150, height: 55 },
    { range: 160, height: 50 },
    { range: 170, height: 45 },
    { range: 180, height: 40 },
    { range: 190, height: 35 },
    { range: 200, height: 30 },
    { range: 220, height: 25 },
    { range: 240, height: 20 },
    { range: 260, height: 15 },
    { range: 280, height: 10 },
    { range: 300, height: 8 }
  ];

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    // Ensure min doesn't exceed max minus gap
    if (value <= maxPrice - GAP) {
      setMinPrice(value);
    } else {
      setMinPrice(maxPrice - GAP);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    // Ensure max doesn't go below min plus gap
    if (value >= minPrice + GAP) {
      setMaxPrice(value);
    } else {
      setMaxPrice(minPrice + GAP);
    }
  };

  // Update parent component when values change
  useEffect(() => {
    onRangeChange(minPrice, maxPrice >= MAX_RANGE ? null : maxPrice);
  }, [minPrice, maxPrice, onRangeChange]);

  // Calculate positions for the range track
  const minPercent = ((minPrice - MIN_RANGE) / (MAX_RANGE - MIN_RANGE)) * 100;
  const maxPercent = ((maxPrice - MIN_RANGE) / (MAX_RANGE - MIN_RANGE)) * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Your budget (per night)
      </h3>
      
      {/* Selected Range Display */}
      <div className="text-sm text-gray-600 mb-4">
        From € {minPrice} to € {maxPrice >= MAX_RANGE ? `${maxPrice}+` : maxPrice}
      </div>

      {/* Slider Container */}
      <div className="relative w-full h-20 mb-4">
        {/* Histogram Background */}
        <div className="absolute inset-x-0 bottom-8 flex items-end justify-between h-12">
          {histogramData.map((bar, index) => (
            <div
              key={index}
              className="bg-gray-300 w-2 transition-all duration-200"
              style={{ 
                height: `${(bar.height / 80) * 100}%`,
                marginRight: index < histogramData.length - 1 ? '2px' : '0'
              }}
            />
          ))}
        </div>

        {/* Slider Track Container */}
        <div className="absolute bottom-2 w-full h-6">
          {/* Track Background */}
          <div className="absolute top-1/2 w-full h-2 bg-gray-200 rounded-full transform -translate-y-1/2" />
          
          {/* Active Track */}
          <div 
            className="absolute top-1/2 h-2 bg-blue-500 rounded-full transform -translate-y-1/2"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`
            }}
          />

          {/* Min Range Slider */}
          <input
            ref={minSliderRef}
            type="range"
            min={MIN_RANGE}
            max={MAX_RANGE}
            value={minPrice}
            onChange={handleMinChange}
            className="absolute w-full h-6 bg-transparent appearance-none cursor-pointer slider-thumb min-slider"
            style={{ zIndex: minPrice > maxPrice - 50 ? 3 : 1 }}
          />

          {/* Max Range Slider */}
          <input
            ref={maxSliderRef}
            type="range"
            min={MIN_RANGE}
            max={MAX_RANGE}
            value={maxPrice}
            onChange={handleMaxChange}
            className="absolute w-full h-6 bg-transparent appearance-none cursor-pointer slider-thumb max-slider"
            style={{ zIndex: minPrice > maxPrice - 50 ? 1 : 3 }}
          />
        </div>
      </div>

      {/* Custom CSS for slider thumbs */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          position: relative;
          z-index: 10;
          pointer-events: auto;
        }

        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          border: none;
          pointer-events: auto;
        }

        .slider-thumb::-webkit-slider-track {
          background: transparent;
          pointer-events: none;
        }

        .slider-thumb::-moz-range-track {
          background: transparent;
          pointer-events: none;
        }

        .slider-thumb {
          pointer-events: auto;
        }

        .min-slider::-webkit-slider-thumb {
          background: #3b82f6;
        }

        .max-slider::-webkit-slider-thumb {
          background: #3b82f6;
        }
      `}</style>
    </div>
  );
}