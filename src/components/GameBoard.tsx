import { useState } from "react";
import { cn } from "@/lib/utils";
import { Hole } from "./Hole";
import { PlayerInfo } from "./PlayerInfo";
import { GameControls } from "./GameControls";

export interface GameState {
  board: number[][];
  stores: number[];
  currentPlayer: number;
  gameOver: boolean;
  winner: number | null;
}

const INITIAL_SEEDS = 4;

export const GameBoard = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: [
      [INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS],
      [INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS]
    ],
    stores: [0, 0],
    currentPlayer: 0,
    gameOver: false,
    winner: null
  });

  const makeMove = (row: number, hole: number) => {
    if (gameState.gameOver || gameState.board[row][hole] === 0 || row !== gameState.currentPlayer) {
      return;
    }

    const newBoard = gameState.board.map(r => [...r]);
    const newStores = [...gameState.stores];
    
    let seeds = newBoard[row][hole];
    newBoard[row][hole] = 0;
    
    let currentRow = row;
    let currentHole = hole;
    
    // Sow seeds counterclockwise
    while (seeds > 0) {
      // Move to next position
      if (currentRow === 0) {
        if (currentHole < 5) {
          currentHole++;
        } else {
          // Move to player 0's store if it's player 0's turn
          if (gameState.currentPlayer === 0) {
            newStores[0]++;
            seeds--;
            if (seeds === 0) break;
          }
          currentRow = 1;
          currentHole = 5;
        }
      } else {
        if (currentHole > 0) {
          currentHole--;
        } else {
          // Move to player 1's store if it's player 1's turn
          if (gameState.currentPlayer === 1) {
            newStores[1]++;
            seeds--;
            if (seeds === 0) break;
          }
          currentRow = 0;
          currentHole = 0;
        }
      }
      
      if (seeds > 0) {
        newBoard[currentRow][currentHole]++;
        seeds--;
      }
    }

    // Check for capture
    if (seeds === 0 && currentRow === gameState.currentPlayer && newBoard[currentRow][currentHole] === 1) {
      const oppositeRow = 1 - currentRow;
      const oppositeHole = currentRow === 0 ? currentHole : currentHole;
      
      if (newBoard[oppositeRow][oppositeHole] > 0) {
        newStores[gameState.currentPlayer] += newBoard[currentRow][currentHole] + newBoard[oppositeRow][oppositeHole];
        newBoard[currentRow][currentHole] = 0;
        newBoard[oppositeRow][oppositeHole] = 0;
      }
    }

    // Check if game is over
    const player0Empty = newBoard[0].every(h => h === 0);
    const player1Empty = newBoard[1].every(h => h === 0);
    
    let winner = null;
    let gameOver = false;
    
    if (player0Empty || player1Empty) {
      // Add remaining seeds to respective stores
      newStores[0] += newBoard[0].reduce((sum, seeds) => sum + seeds, 0);
      newStores[1] += newBoard[1].reduce((sum, seeds) => sum + seeds, 0);
      
      newBoard[0].fill(0);
      newBoard[1].fill(0);
      
      gameOver = true;
      winner = newStores[0] > newStores[1] ? 0 : newStores[1] > newStores[0] ? 1 : null;
    }

    setGameState({
      board: newBoard,
      stores: newStores,
      currentPlayer: gameOver ? gameState.currentPlayer : 1 - gameState.currentPlayer,
      gameOver,
      winner
    });
  };

  const resetGame = () => {
    setGameState({
      board: [
        [INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS],
        [INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS, INITIAL_SEEDS]
      ],
      stores: [0, 0],
      currentPlayer: 0,
      gameOver: false,
      winner: null
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 min-h-screen bg-gradient-warm">
      <h1 className="text-4xl font-bold text-primary mb-2">ገቦታ Gebeta</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Traditional Ethiopian Mancala Game
      </p>
      
      <div className="flex items-center gap-8 mb-4">
        <PlayerInfo 
          player={1} 
          score={gameState.stores[1]} 
          isActive={gameState.currentPlayer === 1}
          name="Player 2"
        />
        <PlayerInfo 
          player={0} 
          score={gameState.stores[0]} 
          isActive={gameState.currentPlayer === 0}
          name="Player 1"
        />
      </div>

      <div className={cn(
        "relative bg-gradient-board rounded-3xl p-6 shadow-2xl",
        "border-4 border-board-accent"
      )}>
        {/* Player 1's row (top, reversed for visual layout) */}
        <div className="flex gap-4 mb-6">
          {gameState.board[1].slice().reverse().map((seeds, index) => (
            <Hole
              key={`p1-${5 - index}`}
              seeds={seeds}
              onClick={() => makeMove(1, 5 - index)}
              disabled={gameState.currentPlayer !== 1 || gameState.gameOver}
              highlight={gameState.currentPlayer === 1 && !gameState.gameOver}
            />
          ))}
        </div>
        
        {/* Player 0's row (bottom) */}
        <div className="flex gap-4">
          {gameState.board[0].map((seeds, index) => (
            <Hole
              key={`p0-${index}`}
              seeds={seeds}
              onClick={() => makeMove(0, index)}
              disabled={gameState.currentPlayer !== 0 || gameState.gameOver}
              highlight={gameState.currentPlayer === 0 && !gameState.gameOver}
            />
          ))}
        </div>
      </div>

      <GameControls
        gameState={gameState}
        onReset={resetGame}
      />
    </div>
  );
};