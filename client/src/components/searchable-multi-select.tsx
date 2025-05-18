import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

interface SearchableMultiSelectProps {
  options: string[];
  selected: string[];
  onSelect: (values: string[]) => void;
  placeholder?: string;
}

export function SearchableMultiSelect({ options, selected, onSelect, placeholder = "Select..." }: SearchableMultiSelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filtered = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const display = selected.length > 0 ? selected.join(", ") : placeholder;

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
      <DropdownMenuContent className="w-full min-w-[220px] max-h-60 overflow-y-auto p-1" align="start">
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-40 overflow-y-auto">
          {filtered.map(option => (
            <label key={option} className="flex items-center gap-2 cursor-pointer select-none px-2 py-1">
              <Checkbox
                checked={selected.includes(option)}
                onCheckedChange={checked => {
                  if (checked) onSelect([...selected, option]);
                  else onSelect(selected.filter(v => v !== option));
                }}
              />
              {option}
            </label>
          ))}
          {filtered.length === 0 && (
            <div className="text-gray-400 text-sm px-2">No options found</div>
          )}
        </div>
        <div className="flex justify-end mt-2">
          <Button type="button" size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 