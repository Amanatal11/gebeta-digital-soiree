import { useState } from "react";
import { cn } from "@/lib/utils";
import { Hole } from "./Hole";
import { PlayerInfo } from "./PlayerInfo";
import { GameControls } from "./GameControls";
import { GameSetup, GameVariant } from "./GameSetup";
import { validateMove, validateGameState, validateGameReset, ValidationResult } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { getHintSuggestion, HintResponse } from "@/lib/utils";

export interface GameState {
  board: number[][];
  stores: number[];
  currentPlayer: number;
  gameOver: boolean;
  winner: number | null;
  variant: GameVariant;
  phase: 'setup' | 'race' | 'playing';
  racePhase?: {
    player0Position: number;
    player1Position: number;
    winner: number | null;
  };
  relaySowing: boolean;
}

const getInitialSeeds = (variant: GameVariant): number => {
  return variant === '12-hole' ? 4 : 3;
};

const getInitialBoard = (variant: GameVariant): number[][] => {
  const seeds = getInitialSeeds(variant);
  if (variant === '12-hole') {
    return [
      [seeds, seeds, seeds, seeds, seeds, seeds],
      [seeds, seeds, seeds, seeds, seeds, seeds]
    ];
  } else {
    return [
      [seeds, seeds, seeds, seeds, seeds, seeds], // Player 0's row
      [seeds, seeds, seeds, seeds, seeds, seeds], // Middle row
      [seeds, seeds, seeds, seeds, seeds, seeds]  // Player 1's row
    ];
  }
};

export const GameBoard = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    stores: [0, 0],
    currentPlayer: 0,
    gameOver: false,
    winner: null,
    variant: '12-hole',
    phase: 'setup',
    relaySowing: false
  });
  const [hintState, setHintState] = useState<{
    suggestedHole: number | null;
    suggestedRow: number | null;
    isLoading: boolean;
    reasoning: string | null;
  }>({
    suggestedHole: null,
    suggestedRow: null,
    isLoading: false,
    reasoning: null
  });

  const startGame = (variant: GameVariant) => {
    // Validate game setup
    const validation = validateGameState({
      board: [],
      stores: [0, 0],
      currentPlayer: 0,
      gameOver: false,
      winner: null,
      variant,
      phase: 'setup',
      relaySowing: false
    });

    if (!validation.isValid) {
      toast({
        title: "Setup Error",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    const initialBoard = getInitialBoard(variant);
    const initialState: GameState = {
      board: initialBoard,
      stores: [0, 0],
      currentPlayer: 0,
      gameOver: false,
      winner: null,
      variant,
      phase: variant === '18-hole' ? 'race' : 'playing',
      relaySowing: false
    };

    if (variant === '18-hole') {
      initialState.racePhase = {
        player0Position: 0,
        player1Position: 0,
        winner: null
      };
    }

    setGameState(initialState);
  };

  const makeRaceMove = (player: number, hole: number) => {
    if (gameState.phase !== 'race' || !gameState.racePhase) return;

    // Only allow leftmost pit (hole 0 for player 0, hole 5 for player 1 due to reversal)
    const leftmostHole = player === 0 ? 0 : 5;
    if (hole !== leftmostHole) return;

    const newRacePhase = { ...gameState.racePhase };

    // Simulate sowing from leftmost pit
    let seeds = gameState.board[player === 0 ? 0 : 2][hole];
    let steps = 0;
    let currentHole = hole;
    let currentRow = player === 0 ? 0 : 2;

    // Sow seeds counterclockwise around the board
    while (seeds > 0 && steps < 18) { // Prevent infinite loops
      currentHole = (currentHole + 1) % 6;
      if (currentHole === 0 && currentRow < 2) {
        currentRow++;
      }
      if (currentHole === 5 && currentRow > 0) {
        currentRow--;
      }
      seeds--;
      steps++;
      if (seeds === 0) break;
    }

    // Check if landed in empty pit
    const landedInEmpty = gameState.board[currentRow][currentHole] === 0;

    if (player === 0) {
      newRacePhase.player0Position = steps;
    } else {
      newRacePhase.player1Position = steps;
    }

    // If both players have moved, determine winner
    if (newRacePhase.player0Position > 0 && newRacePhase.player1Position > 0) {
      if (landedInEmpty) {
        newRacePhase.winner = player;
      } else {
        // The one who took fewer steps wins
        newRacePhase.winner = newRacePhase.player0Position < newRacePhase.player1Position ? 0 : 1;
      }
    }

    setGameState({
      ...gameState,
      racePhase: newRacePhase,
      phase: newRacePhase.winner !== null ? 'playing' : 'race',
      currentPlayer: newRacePhase.winner ?? gameState.currentPlayer
    });
  };

  const makeGameMove = (row: number, hole: number) => {
    if (gameState.gameOver || gameState.board[row][hole] === 0 ||
      (gameState.variant === '12-hole' && row !== gameState.currentPlayer) ||
      gameState.phase !== 'playing') {
      return;
    }

    const newBoard = gameState.board.map(r => [...r]);
    const newStores = [...gameState.stores];

    let seeds = newBoard[row][hole];
    newBoard[row][hole] = 0;

    let currentRow = row;
    let currentHole = hole;
    let relayContinue = false;

    // Sow seeds counterclockwise
    while (seeds > 0) {
      // Calculate next position based on variant
      if (gameState.variant === '12-hole') {
        // 12-hole logic
        if (currentRow === 0) {
          if (currentHole < 5) {
            currentHole++;
          } else {
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
            if (gameState.currentPlayer === 1) {
              newStores[1]++;
              seeds--;
              if (seeds === 0) break;
            }
            currentRow = 0;
            currentHole = 0;
          }
        }
      } else {
        // 18-hole logic (counterclockwise around all rows)
        const totalHoles = 18;
        let currentIndex = currentRow * 6 + currentHole;
        currentIndex = (currentIndex + 1) % totalHoles;
        currentRow = Math.floor(currentIndex / 6);
        currentHole = currentIndex % 6;
      }

      if (seeds > 0) {
        newBoard[currentRow][currentHole]++;
        seeds--;
      }
    }

    // Check for capture (Gabata rules)
    let captured = false;
    if (seeds === 0) {
      if (gameState.variant === '12-hole') {
        // Classic capture: last seed in empty pit on player's side
        if (currentRow === gameState.currentPlayer && newBoard[currentRow][currentHole] === 1) {
          const oppositeRow = 1 - currentRow;
          if (newBoard[oppositeRow][currentHole] > 0) {
            newStores[gameState.currentPlayer] += newBoard[currentRow][currentHole] + newBoard[oppositeRow][currentHole];
            newBoard[currentRow][currentHole] = 0;
            newBoard[oppositeRow][currentHole] = 0;
            captured = true;
          }
        }
      } else {
        // Gabata capture: last seed in empty pit on player's row
        if ((currentRow === 0 && gameState.currentPlayer === 0) ||
          (currentRow === 2 && gameState.currentPlayer === 1)) {
          if (newBoard[currentRow][currentHole] === 1) {
            // For 18-hole, capture from opposite pits across middle row
            const oppositeRow = currentRow === 0 ? 2 : 0;
            if (newBoard[oppositeRow][currentHole] > 0) {
              newStores[gameState.currentPlayer] += newBoard[currentRow][currentHole] + newBoard[oppositeRow][currentHole];
              newBoard[currentRow][currentHole] = 0;
              newBoard[oppositeRow][currentHole] = 0;
              captured = true;
            }
          }
        }
        // Check for relay sowing: if last seed lands in occupied pit
        if (newBoard[currentRow][currentHole] > 1) {
          relayContinue = true;
        }
      }
    }

    // Check if game is over
    let winner = null;
    let gameOver = false;

    if (gameState.variant === '12-hole') {
      const player0Empty = newBoard[0].every(h => h === 0);
      const player1Empty = newBoard[1].every(h => h === 0);

      if (player0Empty || player1Empty) {
        newStores[0] += newBoard[0].reduce((sum, seeds) => sum + seeds, 0);
        newStores[1] += newBoard[1].reduce((sum, seeds) => sum + seeds, 0);
        newBoard.forEach(row => row.fill(0));
        gameOver = true;
        winner = newStores[0] > newStores[1] ? 0 : newStores[1] > newStores[0] ? 1 : null;
      }
    } else {
      // 18-hole: game ends when a player can't make a move or captures majority
      const player0CanMove = newBoard[0].some(h => h > 0);
      const player1CanMove = newBoard[2].some(h => h > 0);

      if (!player0CanMove || !player1CanMove) {
        // Add remaining seeds to stores
        newStores[0] += newBoard[0].reduce((sum, seeds) => sum + seeds, 0) +
          newBoard[1].reduce((sum, seeds) => sum + seeds, 0);
        newStores[1] += newBoard[2].reduce((sum, seeds) => sum + seeds, 0);
        newBoard.forEach(row => row.fill(0));
        gameOver = true;
        winner = newStores[0] > newStores[1] ? 0 : newStores[1] > newStores[0] ? 1 : null;
      }
    }

    setGameState({
      ...gameState,
      board: newBoard,
      stores: newStores,
      currentPlayer: relayContinue ? gameState.currentPlayer :
        gameOver ? gameState.currentPlayer :
          1 - gameState.currentPlayer,
      gameOver,
      winner,
      relaySowing: relayContinue
    });
  };

  const makeMove = (row: number, hole: number) => {
    // Clear any existing hints when making a move
    clearHint();

    // Validate the move before executing
    const validation = validateMove(gameState, row, hole);

    if (!validation.isValid) {
      // Show validation error as toast
      toast({
        title: validation.type === 'error' ? "Invalid Move" : "Cannot Move",
        description: validation.message,
        variant: validation.type === 'error' ? "destructive" : "default",
      });
      return;
    }

    if (gameState.phase === 'race') {
      makeRaceMove(gameState.currentPlayer, hole);
    } else {
      makeGameMove(row, hole);
    }
  };

  const resetGame = () => {
    const validation = validateGameReset(gameState);

    if (validation.message) {
      toast({
        title: "Resetting Game",
        description: validation.message,
        variant: validation.type === 'error' ? "destructive" : "default",
      });
    }

    setGameState({
      board: [],
      stores: [0, 0],
      currentPlayer: 0,
      gameOver: false,
      winner: null,
      variant: '12-hole',
      phase: 'setup',
      relaySowing: false
    });

    // Clear hint state when resetting
    setHintState({
      suggestedHole: null,
      suggestedRow: null,
      isLoading: false,
      reasoning: null
    });
  };

  const getHint = async () => {
    if (gameState.gameOver || gameState.phase !== 'playing') {
      return;
    }

    setHintState(prev => ({ ...prev, isLoading: true }));

    try {
      const hintResponse = await getHintSuggestion({
        board: gameState.board,
        currentPlayer: gameState.currentPlayer,
        variant: gameState.variant,
        stores: gameState.stores
      });

      // Determine which row the suggested hole is on
      let suggestedRow: number;
      if (gameState.variant === '12-hole') {
        suggestedRow = gameState.currentPlayer;
      } else {
        suggestedRow = gameState.currentPlayer === 0 ? 0 : 2;
      }

      setHintState({
        suggestedHole: hintResponse.suggestedHole,
        suggestedRow,
        isLoading: false,
        reasoning: hintResponse.reasoning
      });

      // Show hint reasoning in toast
      toast({
        title: "💡 Hint Suggestion",
        description: hintResponse.reasoning,
        variant: "default",
      });

    } catch (error) {
      setHintState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Hint Error",
        description: error instanceof Error ? error.message : "Failed to get hint suggestion",
        variant: "destructive",
      });
    }
  };

  const clearHint = () => {
    setHintState({
      suggestedHole: null,
      suggestedRow: null,
      isLoading: false,
      reasoning: null
    });
  };

  // Show setup screen if game hasn't started
  if (gameState.phase === 'setup') {
    return <GameSetup onStartGame={startGame} />;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4 min-h-screen bg-gradient-warm">
      {/* Ethiopian header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">
          ገበጣ {gameState.variant === '18-hole' ? 'Gabata' : 'Gebeta'}
        </h1>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          Traditional Ethiopian Mancala Game • {gameState.variant === '18-hole' ? '3-Row' : 'Classic'} Variant
        </p>

        {/* Game phase indicator */}
        {gameState.phase === 'race' && (
          <div className="bg-card/80 p-4 rounded-lg mb-4 max-w-md">
            <h3 className="font-semibold text-primary mb-2">🏁 Race Phase</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Both players sow from their leftmost pit simultaneously</p>
              <p>Winner of the race goes first in the main game!</p>
              <p className="text-xs mt-2">
                Player 1: {gameState.racePhase?.player0Position || 0} steps •
                Player 2: {gameState.racePhase?.player1Position || 0} steps
              </p>
            </div>
          </div>
        )}

        {/* Quick tutorial */}
        {!gameState.gameOver && gameState.phase === 'playing' && (
          <div className="bg-card/80 p-4 rounded-lg mb-4 max-w-md">
            <h3 className="font-semibold text-primary mb-2">How to Play:</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>🎯 <strong>Click</strong> any hole on your side</p>
              <p>🌱 Seeds will sow <strong>counterclockwise</strong></p>
              {gameState.variant === '12-hole' ? (
                <p>🏆 <strong>Capture</strong> when last seed lands in empty hole</p>
              ) : (
                <>
                  <p>🏆 <strong>Capture</strong> when last seed lands in empty pit on your row</p>
                  <p>🔄 <strong>Relay</strong> sowing continues if last seed lands in occupied pit</p>
                </>
              )}
              <p>🎉 Collect more seeds than opponent to win!</p>
            </div>
          </div>
        )}
      </div>

      {/* Current turn indicator */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <span className="font-medium">
            {gameState.phase === 'race' ? 'Race Phase' : `Player ${gameState.currentPlayer + 1}'s Turn`}
            {gameState.relaySowing && ' (Relay)'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8 mb-4">
        <PlayerInfo
          player={gameState.variant === '12-hole' ? 1 : 2}
          score={gameState.stores[1]}
          isActive={gameState.currentPlayer === 1 && gameState.phase === 'playing'}
          name="Player 2"
        />
        <PlayerInfo
          player={gameState.variant === '12-hole' ? 0 : 0}
          score={gameState.stores[0]}
          isActive={gameState.currentPlayer === 0 && gameState.phase === 'playing'}
          name="Player 1"
        />
      </div>

      <div className={cn(
        "relative bg-gradient-board rounded-3xl p-6 shadow-2xl",
        "border-4 border-board-accent"
      )}>
        {gameState.variant === '12-hole' ? (
          <>
            {/* Player 1's row (top, reversed for visual layout) */}
            <div className="flex gap-4 mb-6">
              {gameState.board[1].slice().reverse().map((seeds, index) => (
                <Hole
                  key={`p1-${5 - index}`}
                  seeds={seeds}
                  onClick={() => makeMove(1, 5 - index)}
                  disabled={gameState.currentPlayer !== 1 || gameState.gameOver || gameState.phase !== 'playing'}
                  highlight={gameState.currentPlayer === 1 && !gameState.gameOver && gameState.phase === 'playing'}
                  hintHighlight={hintState.suggestedRow === 1 && hintState.suggestedHole === (5 - index)}
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
                  disabled={gameState.currentPlayer !== 0 || gameState.gameOver || gameState.phase !== 'playing'}
                  highlight={gameState.currentPlayer === 0 && !gameState.gameOver && gameState.phase === 'playing'}
                  hintHighlight={hintState.suggestedRow === 0 && hintState.suggestedHole === index}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Player 1's row (top, reversed) */}
            <div className="flex gap-4 mb-4">
              {gameState.board[2].slice().reverse().map((seeds, index) => (
                <Hole
                  key={`p2-${5 - index}`}
                  seeds={seeds}
                  onClick={() => gameState.phase === 'race' ? makeMove(2, 5 - index) : makeMove(2, 5 - index)}
                  disabled={
                    gameState.phase === 'race' ? gameState.racePhase?.player1Position !== 0 :
                      gameState.currentPlayer !== 1 || gameState.gameOver || gameState.phase !== 'playing'
                  }
                  highlight={
                    gameState.phase === 'race' ? gameState.racePhase?.player1Position === 0 :
                      gameState.currentPlayer === 1 && !gameState.gameOver && gameState.phase === 'playing'
                  }
                  hintHighlight={hintState.suggestedRow === 2 && hintState.suggestedHole === (5 - index)}
                />
              ))}
            </div>

            {/* Middle row */}
            <div className="flex gap-4 mb-4">
              {gameState.board[1].slice().reverse().map((seeds, index) => (
                <Hole
                  key={`middle-${5 - index}`}
                  seeds={seeds}
                  onClick={() => makeMove(1, 5 - index)}
                  disabled={true} // Middle row not playable directly
                  highlight={false}
                  hintHighlight={false}
                />
              ))}
            </div>

            {/* Player 0's row (bottom) */}
            <div className="flex gap-4">
              {gameState.board[0].map((seeds, index) => (
                <Hole
                  key={`p0-${index}`}
                  seeds={seeds}
                  onClick={() => gameState.phase === 'race' ? makeMove(0, index) : makeMove(0, index)}
                  disabled={
                    gameState.phase === 'race' ? gameState.racePhase?.player0Position !== 0 :
                      gameState.currentPlayer !== 0 || gameState.gameOver || gameState.phase !== 'playing'
                  }
                  highlight={
                    gameState.phase === 'race' ? gameState.racePhase?.player0Position === 0 :
                      gameState.currentPlayer === 0 && !gameState.gameOver && gameState.phase === 'playing'
                  }
                  hintHighlight={hintState.suggestedRow === 0 && hintState.suggestedHole === index}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <GameControls
        gameState={gameState}
        onReset={resetGame}
        onHint={getHint}
        isHintLoading={hintState.isLoading}
      />
    </div>
  );
};