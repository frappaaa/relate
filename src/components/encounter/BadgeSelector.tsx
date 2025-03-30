
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { BadgeCheck } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface BadgeOption {
  id: string;
  label: string;
}

interface BadgeSelectorProps {
  options: BadgeOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  multiSelect?: boolean;
}

const BadgeSelector: React.FC<BadgeSelectorProps> = ({
  options,
  selectedValues,
  onChange,
  multiSelect = true
}) => {
  const handleBadgeClick = (optionId: string) => {
    if (multiSelect) {
      // For multi-select, toggle the selection
      const newValues = selectedValues.includes(optionId)
        ? selectedValues.filter(id => id !== optionId)
        : [...selectedValues, optionId];
      onChange(newValues);
    } else {
      // For single-select, replace the current selection
      onChange([optionId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.id);
        return (
          <Badge
            key={option.id}
            variant="outline"
            className={cn(
              "py-2 px-3 flex items-center gap-2 text-sm transition-all cursor-pointer",
              isSelected
                ? "bg-primary/70 border-primary/60 text-primary-foreground hover:bg-primary/80"
                : "hover:bg-secondary/80"
            )}
            onClick={() => handleBadgeClick(option.id)}
          >
            {isSelected && <BadgeCheck className="h-4 w-4" />}
            <span>{option.label}</span>
          </Badge>
        );
      })}
    </div>
  );
};

export default BadgeSelector;
