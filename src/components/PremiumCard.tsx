import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PremiumCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: string;
  title: string;
  description?: string;
  className?: string;
}

export function PremiumCard({
  selected,
  onClick,
  icon,
  title,
  description,
  className,
}: PremiumCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full p-4 rounded-xl text-left transition-all duration-200",
        "border bg-card shadow-sm hover:shadow-md",
        selected
          ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
          : "border-border hover:border-primary/30 hover:bg-secondary/50",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <span className="text-2xl flex-shrink-0">{icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-[15px] transition-colors",
            selected ? "text-primary" : "text-foreground"
          )}>
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        {selected && (
          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
      </div>
    </button>
  );
}

interface SkillChipProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

export function SkillChip({ selected, onClick, label, disabled }: SkillChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
        "border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1",
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-secondary/50",
        disabled && !selected && "opacity-50 cursor-not-allowed"
      )}
    >
      {label}
    </button>
  );
}