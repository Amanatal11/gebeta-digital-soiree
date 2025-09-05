import { cn } from "@/lib/utils";
import { Crown, User } from "lucide-react";

interface PlayerInfoProps {
  player: number;
  score: number;
  isActive: boolean;
  name: string;
}

export const PlayerInfo = ({ player, score, isActive, name }: PlayerInfoProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center gap-2 p-4 rounded-xl relative",
      "bg-card border-2 transition-all duration-300",
      isActive ? "border-accent shadow-lg scale-105" : "border-border",
      "min-w-[120px]"
    )}>
      {/* Small Ethiopian cross decoration */}
      {isActive && (
        <div className="absolute -top-2 -right-2">
          <img src="/ethiopian-cross.svg" alt="" className="w-4 h-4 opacity-70" />
        </div>
      )}

      <div className={cn(
        "flex items-center gap-2",
        isActive && "text-accent"
      )}>
        <User className="w-5 h-5" />
        <span className="font-semibold">{name}</span>
      </div>

      <div className={cn(
        "text-2xl font-bold",
        isActive ? "text-accent" : "text-muted-foreground"
      )}>
        {score}
      </div>

      {isActive && (
        <div className="flex items-center gap-1 text-sm text-accent">
          <Crown className="w-4 h-4" />
          <span>Your Turn</span>
        </div>
      )}
    </div>
  );
};