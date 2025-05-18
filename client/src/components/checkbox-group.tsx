import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxGroupProps {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  label?: string;
}

export function CheckboxGroup({ options, selected, onChange, label }: CheckboxGroupProps) {
  const handleChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, option]);
    } else {
      onChange(selected.filter((v) => v !== option));
    }
  };

  return (
    <div>
      {label && <div className="mb-2 font-medium">{label}</div>}
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer select-none">
            <Checkbox
              checked={selected.includes(option)}
              onCheckedChange={(checked) => handleChange(option, !!checked)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
} 