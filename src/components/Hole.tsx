import { cn } from "@/lib/utils";

interface HoleProps {
  seeds: number;
  onClick: () => void;
  disabled: boolean;
  highlight: boolean;
}

export const Hole = ({ seeds, onClick, disabled, highlight }: HoleProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-20 h-20 rounded-full transition-all duration-300",
        "bg-gradient-hole border-2 border-hole-shadow/30",
        "flex items-center justify-center",
        "shadow-inner",
        !disabled && "hover:scale-105 hover:shadow-lg",
        highlight && !disabled && "ring-2 ring-capture-highlight ring-offset-2",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Seeds visualization */}
      <div className="relative">
        {seeds > 0 && (
          <div className={cn(
            "absolute inset-0 flex items-center justify-center",
            "font-bold text-lg text-primary-foreground",
            "drop-shadow-sm"
          )}>
            {seeds}
          </div>
        )}
        
        {/* Visual seeds for smaller numbers */}
        {seeds > 0 && seeds <= 8 && (
          <div className="grid grid-cols-3 gap-1 w-12 h-12">
            {Array.from({ length: Math.min(seeds, 9) }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full bg-gradient-seed",
                  "shadow-sm animate-pulse",
                  index < 6 ? "opacity-100" : "opacity-60"
                )}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationDuration: "2s"
                }}
              />
            ))}
          </div>
        )}
      </div>
    </button>
  );
};