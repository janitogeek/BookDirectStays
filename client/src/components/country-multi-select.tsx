import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

// Full list of all countries in the world
const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

interface CountryMultiSelectProps {
  options?: string[];
  selected: string[];
  onSelect: (values: string[]) => void;
  className?: string;
}

export function CountryMultiSelect({ options, selected, onSelect, className }: CountryMultiSelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const countryList = options || ALL_COUNTRIES;
  const filtered = countryList.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const display = selected.length > 0 ? selected.join(", ") : "e.g. United States, France";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={`w-full justify-between text-left ${className || ''}`}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={selected.length === 0 ? "text-muted-foreground" : ""}>{display}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[220px] max-h-64 p-1 flex flex-col" align="start">
        <div className="flex-shrink-0">
          <Input
            ref={inputRef}
            placeholder="e.g. United States, France"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-2"
          />
        </div>
        <div className="flex-1 max-h-36 overflow-y-auto">
          {filtered.map(country => (
            <label key={country} className="flex items-center gap-2 cursor-pointer select-none px-2 py-1">
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
            <div className="text-gray-400 text-sm px-2">No countries found</div>
          )}
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