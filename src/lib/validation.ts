import { GameState } from "@/components/GameBoard";

export interface ValidationResult {
    isValid: boolean;
    message?: string;
    type?: 'error' | 'warning' | 'info';
}

/**
 * Validates if a move is allowed based on game rules
 */
export const validateMove = (
    gameState: GameState,
    row: number,
    hole: number
): ValidationResult => {
    // Check if game is over
    if (gameState.gameOver) {
        return {
            isValid: false,
            message: "Game is over! Start a new game to continue playing.",
            type: "error"
        };
    }

    // Check if it's the correct phase
    if (gameState.phase !== 'playing' && gameState.phase !== 'race') {
        return {
            isValid: false,
            message: "Game hasn't started yet. Choose a variant to begin!",
            type: "error"
        };
    }

    // Race phase validation
    if (gameState.phase === 'race') {
        if (!gameState.racePhase) {
            return {
                isValid: false,
                message: "Race phase not properly initialized.",
                type: "error"
            };
        }

        const isPlayer0 = row === 0;
        const isPlayer1 = gameState.variant === '12-hole' ? row === 1 : row === 2;

        if (!isPlayer0 && !isPlayer1) {
            return {
                isValid: false,
                message: "Invalid row for race phase move.",
                type: "error"
            };
        }

        // Check if player has already moved
        const playerIndex = isPlayer0 ? 0 : 1;
        const playerPosition = playerIndex === 0 ?
            gameState.racePhase.player0Position :
            gameState.racePhase.player1Position;

        if (playerPosition > 0) {
            return {
                isValid: false,
                message: `Player ${playerIndex + 1} has already completed their race move.`,
                type: "error"
            };
        }

        // Only leftmost pit allowed
        const leftmostHole = isPlayer0 ? 0 : 5;
        if (hole !== leftmostHole) {
            return {
                isValid: false,
                message: "During race phase, you can only move from your leftmost pit!",
                type: "warning"
            };
        }

        return { isValid: true };
    }

    // Playing phase validation
    if (gameState.phase !== 'playing') {
        return {
            isValid: false,
            message: "Not in playing phase.",
            type: "error"
        };
    }

    // Check if hole has seeds
    if (gameState.board[row][hole] === 0) {
        return {
            isValid: false,
            message: "Cannot move from an empty hole!",
            type: "warning"
        };
    }

    // Check if it's the player's turn and correct row
    const isPlayer0Turn = gameState.currentPlayer === 0;
    const isPlayer1Turn = gameState.currentPlayer === 1;

    if (gameState.variant === '12-hole') {
        // 12-hole: players can only move from their own row
        if (isPlayer0Turn && row !== 0) {
            return {
                isValid: false,
                message: "Player 1 can only move from the bottom row!",
                type: "error"
            };
        }
        if (isPlayer1Turn && row !== 1) {
            return {
                isValid: false,
                message: "Player 2 can only move from the top row!",
                type: "error"
            };
        }
    } else {
        // 18-hole: players can only move from their own row (0 or 2)
        if (isPlayer0Turn && row !== 0) {
            return {
                isValid: false,
                message: "Player 1 can only move from the bottom row!",
                type: "error"
            };
        }
        if (isPlayer1Turn && row !== 2) {
            return {
                isValid: false,
                message: "Player 2 can only move from the top row!",
                type: "error"
            };
        }
    }

    // Check if game can continue for this player
    const canPlayer0Move = gameState.board[0].some(seeds => seeds > 0);
    const canPlayer1Move = gameState.variant === '12-hole'
        ? gameState.board[1].some(seeds => seeds > 0)
        : gameState.board[2].some(seeds => seeds > 0);

    if (isPlayer0Turn && !canPlayer0Move) {
        return {
            isValid: false,
            message: "Player 1 has no valid moves left!",
            type: "error"
        };
    }

    if (isPlayer1Turn && !canPlayer1Move) {
        return {
            isValid: false,
            message: "Player 2 has no valid moves left!",
            type: "error"
        };
    }

    return { isValid: true };
};

/**
 * Validates game state consistency
 */
export const validateGameState = (gameState: GameState): ValidationResult => {
    // Check board dimensions
    if (gameState.variant === '12-hole') {
        if (gameState.board.length !== 2 || gameState.board.some(row => row.length !== 6)) {
            return {
                isValid: false,
                message: "Invalid board configuration for 12-hole variant.",
                type: "error"
            };
        }
    } else {
        if (gameState.board.length !== 3 || gameState.board.some(row => row.length !== 6)) {
            return {
                isValid: false,
                message: "Invalid board configuration for 18-hole variant.",
                type: "error"
            };
        }
    }

    // Check stores array
    if (gameState.stores.length !== 2 || gameState.stores.some(store => store < 0)) {
        return {
            isValid: false,
            message: "Invalid stores configuration.",
            type: "error"
        };
    }

    // Check current player
    if (gameState.currentPlayer < 0 || gameState.currentPlayer > 1) {
        return {
            isValid: false,
            message: "Invalid current player.",
            type: "error"
        };
    }

    // Check race phase data
    if (gameState.variant === '18-hole' && gameState.phase === 'race') {
        if (!gameState.racePhase) {
            return {
                isValid: false,
                message: "Missing race phase data for 18-hole variant.",
                type: "error"
            };
        }
    }

    return { isValid: true };
};

/**
 * Validates game setup parameters
 */
export const validateGameSetup = (variant: string): ValidationResult => {
    const validVariants = ['12-hole', '18-hole'];

    if (!validVariants.includes(variant)) {
        return {
            isValid: false,
            message: "Invalid game variant selected.",
            type: "error"
        };
    }

    return { isValid: true };
};

/**
 * Validates if the game can be reset
 */
export const validateGameReset = (gameState: GameState): ValidationResult => {
    // Always allow reset, but provide feedback
    if (gameState.phase === 'setup') {
        return {
            isValid: true,
            message: "Game already at setup screen.",
            type: "info"
        };
    }

    if (gameState.gameOver) {
        return {
            isValid: true,
            message: "Resetting completed game...",
            type: "info"
        };
    }

    return {
        isValid: true,
        message: "Resetting current game...",
        type: "warning"
    };
};

/**
 * Validates if a capture is valid
 */
export const validateCapture = (
    gameState: GameState,
    row: number,
    hole: number,
    seeds: number
): ValidationResult => {
    if (seeds !== 0) {
        return {
            isValid: false,
            message: "Can only capture when last seed lands in hole.",
            type: "error"
        };
    }

    // Classic Gebeta capture rules
    if (gameState.variant === '12-hole') {
        if (row !== gameState.currentPlayer) {
            return {
                isValid: false,
                message: "Can only capture on your own row.",
                type: "error"
            };
        }

        if (gameState.board[row][hole] !== 1) {
            return {
                isValid: false,
                message: "Can only capture when landing in hole with exactly 1 seed.",
                type: "error"
            };
        }

        const oppositeRow = 1 - row;
        if (gameState.board[oppositeRow][hole] === 0) {
            return {
                isValid: false,
                message: "Cannot capture from empty opposite hole.",
                type: "info"
            };
        }
    } else {
        // Gabata capture rules
        const isPlayerRow = (gameState.currentPlayer === 0 && row === 0) ||
            (gameState.currentPlayer === 1 && row === 2);

        if (!isPlayerRow) {
            return {
                isValid: false,
                message: "Can only capture on your own row.",
                type: "error"
            };
        }

        if (gameState.board[row][hole] !== 1) {
            return {
                isValid: false,
                message: "Can only capture when landing in hole with exactly 1 seed.",
                type: "error"
            };
        }

        const oppositeRow = gameState.currentPlayer === 0 ? 2 : 0;
        if (gameState.board[oppositeRow][hole] === 0) {
            return {
                isValid: false,
                message: "Cannot capture from empty opposite hole.",
                type: "info"
            };
        }
    }

    return { isValid: true };
};
