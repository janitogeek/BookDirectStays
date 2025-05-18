import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface CountryMultiSelectProps {
  options: string[];
  selected: string[];
  onSelect: (values: string[]) => void;
}

export function CountryMultiSelect({ options, selected, onSelect }: CountryMultiSelectProps) {
  const [search, setSearch] = useState("");
  const filtered = options.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Input
        placeholder="Type to search (e.g. fr for France)"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-2"
      />
      <div className="border rounded p-2 max-h-40 overflow-y-auto bg-white">
        {filtered.map(country => (
          <label key={country} className="flex items-center gap-2 cursor-pointer select-none">
            <Checkbox
              checked={selected.includes(country)}
              onCheckedChange={checked => {
                if (checked) onSelect([...selected, country]);
                else onSelect(selected.filter(v => v !== country));
              }}
            />
            {country}
          </label>
        ))}
        {filtered.length === 0 && (
          <div className="text-gray-400 text-sm">No countries found</div>
        )}
      </div>
    </div>
  );
} 