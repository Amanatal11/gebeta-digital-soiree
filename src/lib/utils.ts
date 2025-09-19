import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API utility for hint backend communication
export interface HintRequest {
  board: number[][];
  currentPlayer: number;
  variant: '12-hole' | '18-hole';
  stores: number[];
}

export interface HintResponse {
  suggestedHole: number;
  confidence: number;
  reasoning: string;
}

export interface HintError {
  error: string;
}

export async function getHintSuggestion(gameState: HintRequest): Promise<HintResponse> {
  const backendUrl = 'http://localhost:8000/suggest-move';

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameState),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    if ('error' in data) {
      throw new Error(data.error);
    }

    return data as HintResponse;
  } catch (error) {
    throw new Error(`Failed to get hint: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
