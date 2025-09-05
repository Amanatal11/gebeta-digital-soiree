import { Button } from "@/components/ui/button";
import { GameState } from "./GameBoard";
import { RotateCcw, Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameControlsProps {
  gameState: GameState;
  onReset: () => void;
}

export const GameControls = ({ gameState, onReset }: GameControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {gameState.gameOver && (
        <div className={cn(
          "text-center p-6 rounded-xl bg-card border-2",
          "shadow-lg animate-pulse"
        )}>
          <Trophy className="w-12 h-12 mx-auto mb-3 text-accent" />
          <h2 className="text-2xl font-bold mb-2">
            {gameState.winner === null ? "It's a Tie!" : `Player ${gameState.winner + 1} Wins!`}
          </h2>
          <p className="text-muted-foreground">
            Final Score: {gameState.stores[0]} - {gameState.stores[1]}
          </p>
        </div>
      )}
      
      <div className="flex gap-3">
        <Button 
          onClick={onReset}
          variant="secondary"
          size="lg"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          New Game
        </Button>
        
        <Button 
          variant="outline"
          size="lg"
          className="gap-2"
          disabled
        >
          <Users className="w-4 h-4" />
          Join Online (Coming Soon)
        </Button>
      </div>
      
      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p>
          <strong>How to play:</strong> Click on any hole on your side to sow seeds counterclockwise. 
          Capture seeds by landing your last seed in an empty hole on your side.
        </p>
      </div>
    </div>
  );
};