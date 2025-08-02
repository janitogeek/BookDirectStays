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
  showSelectAll?: boolean;
}

export function SearchableMultiSelect({ options, selected, onSelect, placeholder = "Select...", showSelectAll = true }: SearchableMultiSelectProps) {
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

  // Select All logic
  const allFilteredSelected = filtered.length > 0 && filtered.every(option => selected.includes(option));
  const someFilteredSelected = filtered.some(option => selected.includes(option));

  const handleSelectAll = () => {
    if (allFilteredSelected) {
      // Deselect all filtered options
      onSelect(selected.filter(item => !filtered.includes(item)));
    } else {
      // Select all filtered options
      const newSelected = [...new Set([...selected, ...filtered])];
      onSelect(newSelected);
    }
  };

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
      <DropdownMenuContent className="w-full min-w-[220px] max-h-80 p-1 flex flex-col" align="start">
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-2 flex-shrink-0"
        />
        
        {/* Select All option */}
        {showSelectAll && filtered.length > 0 && (
          <>
            <label className="flex items-center gap-2 cursor-pointer select-none px-2 py-1 hover:bg-blue-50 border-b border-gray-100 mb-1 font-medium text-blue-700">
              <Checkbox
                checked={allFilteredSelected}
                ref={(ref) => {
                  if (ref) {
                    ref.indeterminate = someFilteredSelected && !allFilteredSelected;
                  }
                }}
                onCheckedChange={handleSelectAll}
              />
              Select All {search ? '(filtered)' : `(${filtered.length})`}
            </label>
          </>
        )}
        
        <div className="flex-1 overflow-y-auto max-h-48 min-h-0">
          {filtered.map(option => (
            <label key={option} className="flex items-center gap-2 cursor-pointer select-none px-2 py-1 hover:bg-gray-50">
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
        <div className="flex justify-end mt-2 pt-2 border-t border-gray-100 flex-shrink-0">
          <Button type="button" size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 