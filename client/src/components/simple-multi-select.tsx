import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SimpleMultiSelectProps {
  options: string[];
  selected: string[];
  onSelect: (values: string[]) => void;
  placeholder?: string;
  label?: string;
}

export function SimpleMultiSelect({ options, selected, onSelect, placeholder = "Select...", label }: SimpleMultiSelectProps) {
  // For accessibility, open state
  const [open, setOpen] = useState(false);

  const handleChange = (option: string, checked: boolean) => {
    if (checked) {
      onSelect([...selected, option]);
    } else {
      onSelect(selected.filter((v) => v !== option));
    }
  };

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
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selected.includes(option)}
            onCheckedChange={(checked) => handleChange(option, !!checked)}
            className="capitalize cursor-pointer"
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 