import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

interface CityRegion {
  name: string; // Just the city name (stored value)
  displayName: string; // Full geographic context (shown in dropdown)
  geonameId: number;
}

interface CityRegionAsyncMultiSelectProps {
  selected: CityRegion[];
  onSelect: (values: CityRegion[]) => void;
  placeholder?: string;
}

export function CityRegionAsyncMultiSelect({ selected, onSelect, placeholder = "e.g. New York, Paris" }: CityRegionAsyncMultiSelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<CityRegion[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (search.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetch(`https://secure.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(search)}&featureClass=P&maxRows=20&username=janito`)
        .then(res => res.json())
        .then(data => {
          setResults(
            (data.geonames || []).map((g: any) => ({
              name: g.name, // Just the city name (stored)
              displayName: `${g.name}${g.adminName1 ? ", " + g.adminName1 : ""}${g.countryName ? ", " + g.countryName : ""}`, // Full context (displayed)
              geonameId: g.geonameId,
            }))
          );
        })
        .finally(() => setLoading(false));
    }, 400);
    // eslint-disable-next-line
  }, [search]);

  const isSelected = (city: CityRegion) => selected.some(s => s.geonameId === city.geonameId);

  const display = selected.length > 0 ? selected.map(c => c.name).join(", ") : placeholder;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between text-left"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={selected.length === 0 ? "text-muted-foreground" : ""}>{display}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[260px] max-h-76 p-1 flex flex-col" align="start">
        <div className="flex-shrink-0">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-2"
          />
        </div>
        <div className="flex-1 max-h-44 overflow-y-auto">
          {loading && <div className="text-sm text-muted-foreground px-2 py-1">Searching...</div>}
          {!loading && results.length === 0 && search.length >= 2 && (
            <div className="text-gray-400 text-sm px-2">No cities/regions found</div>
          )}
          {results.map(city => (
            <label key={city.geonameId} className="flex items-center gap-2 cursor-pointer select-none px-2 py-1">
              <Checkbox
                checked={isSelected(city)}
                onCheckedChange={checked => {
                  if (checked) onSelect([...selected, city]);
                  else onSelect(selected.filter(v => v.geonameId !== city.geonameId));
                }}
              />
              {city.displayName}
            </label>
          ))}
        </div>
        <div className="flex-shrink-0 flex justify-end mt-2 pt-2 border-t">
          <Button type="button" size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 