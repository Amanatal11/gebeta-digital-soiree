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
          "shadow-lg border-accent"
        )}>
          <Trophy className="w-12 h-12 mx-auto mb-3 text-accent" />
          <h2 className="text-2xl font-bold mb-2 text-primary">
            {gameState.winner === null ? "It's a Tie!" : `Player ${gameState.winner! + 1} Wins!`}
          </h2>
          <p className="text-muted-foreground mb-4">
            Final Score: {gameState.stores[0]} - {gameState.stores[1]}
          </p>
          <p className="text-sm text-muted-foreground">
            🎉 Great game! Click "New Game" to play again.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 items-center">
        <Button
          onClick={onReset}
          size="lg"
          className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg font-semibold"
        >
          <RotateCcw className="w-5 h-5" />
          New Game
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 opacity-60"
          disabled
        >
          <Users className="w-4 h-4" />
          Multiplayer (Coming Soon)
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground max-w-md p-4 rounded-lg bg-card/30">
        <p className="mb-2">
          <strong>Need help?</strong> The game is simple:
        </p>
        <div className="space-y-1 text-xs">
          <p>• Click any hole with seeds on your side</p>
          <p>• Seeds distribute counterclockwise automatically</p>
          <p>• Capture when your last seed lands in an empty hole</p>
          <p>• Collect the most seeds to win!</p>
        </div>
      </div>
    </div>
  );
};