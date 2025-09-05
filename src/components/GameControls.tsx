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
          "text-center p-6 rounded-xl bg-card border-2 relative",
          "shadow-lg"
        )} style={{
          backgroundImage: "url('/ethiopian-pattern.svg')",
          backgroundSize: "40px 40px",
          backgroundBlendMode: "overlay"
        }}>
          <div className="absolute top-2 left-2 opacity-30">
            <img src="/ethiopian-shield.svg" alt="" className="w-6 h-8" />
          </div>
          <div className="absolute top-2 right-2 opacity-30">
            <img src="/ethiopian-cross.svg" alt="" className="w-6 h-6" />
          </div>

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

      <div className="text-center text-sm text-muted-foreground max-w-md relative p-4 rounded-lg bg-card/50">
        <div className="absolute top-1 left-1 opacity-20">
          <img src="/ethiopian-cross.svg" alt="" className="w-4 h-4" />
        </div>
        <div className="absolute top-1 right-1 opacity-20">
          <img src="/ethiopian-cross.svg" alt="" className="w-4 h-4" />
        </div>
        <p>
          <strong>እንዴት መስመር:</strong> ከእርሶ በኩል ለሆነ ማናቸውም ክፍት ለማስመስ ጠቅ ያድርጉ።
          በእርሶ በኩል ባለው ባዶ ክፍት ላይ የመጨረሻ እርሻ ለመስቀል ያልፈናል።
        </p>
        <p className="mt-2 text-xs opacity-75">
          <strong>How to play:</strong> Click any hole on your side to sow seeds counterclockwise.
          Capture by landing your last seed in an empty hole on your side.
        </p>
      </div>
    </div>
  );
};