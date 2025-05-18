import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

// Sample list of major world cities/regions
const SAMPLE_CITIES = [
  "New York", "London", "Paris", "Tokyo", "Los Angeles", "Berlin", "Sydney", "Toronto", "Dubai", "Singapore", "Hong Kong", "Barcelona", "Rome", "Istanbul", "Bangkok", "Moscow", "San Francisco", "Cape Town", "Rio de Janeiro", "Zanzibar", "Lisbon", "Bali", "Mexico City", "Mumbai", "Shanghai", "Seoul", "Chicago", "Vienna", "Prague", "Budapest"
];

interface CityRegionMultiSelectProps {
  options?: string[];
  selected: string[];
  onSelect: (values: string[]) => void;
}

export function CityRegionMultiSelect({ options, selected, onSelect }: CityRegionMultiSelectProps) {
  const [search, setSearch] = useState("");
  const cityList = options || SAMPLE_CITIES;
  const filtered = cityList.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Input
        placeholder="e.g. Paris or Zanzibar"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-2"
      />
      <div className="border rounded p-2 max-h-40 overflow-y-auto bg-white">
        {filtered.map(city => (
          <label key={city} className="flex items-center gap-2 cursor-pointer select-none">
            <Checkbox
              checked={selected.includes(city)}
              onCheckedChange={checked => {
                if (checked) onSelect([...selected, city]);
                else onSelect(selected.filter(v => v !== city));
              }}
            />
            {city}
          </label>
        ))}
        {filtered.length === 0 && (
          <div className="text-gray-400 text-sm">No cities/regions found</div>
        )}
      </div>
    </div>
  );
} 