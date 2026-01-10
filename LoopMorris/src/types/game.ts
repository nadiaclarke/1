// Game Types for Loop Morris

export type Player = 1 | 2;
export type CellState = 0 | Player; // 0 = empty, 1 = player1, 2 = player2

export type GamePhase = 'placement' | 'movement' | 'capture' | 'gameOver';

export interface GameState {
  board: CellState[];          // 24 nodes
  currentPlayer: Player;
  phase: GamePhase;
  piecesToPlace: [number, number]; // [player1, player2] pieces remaining to place
  pieceCount: [number, number];    // [player1, player2] pieces on board
  winner: Player | null;
  pendingCapture: boolean;         // True if current player must capture after forming loop
  lastMove: Move | null;
  moveHistory: GameState[];        // For undo (stores previous state)
}

export interface PlacementMove {
  type: 'place';
  to: number;
}

export interface MovementMove {
  type: 'move';
  from: number;
  to: number;
}

export interface CaptureMove {
  type: 'capture';
  target: number;
}

export type Move = PlacementMove | MovementMove | CaptureMove;

// Board structure constants
export const NODE_COUNT = 24;
export const PIECES_PER_PLAYER = 9;

// Node positions for rendering (x, y in 0-6 grid)
// Outer square: 0-7, Middle: 8-15, Inner: 16-23
export const NODE_POSITIONS: [number, number][] = [
  // Outer square (clockwise from top-left)
  [0, 0], [3, 0], [6, 0],  // 0, 1, 2
  [6, 3],                   // 3
  [6, 6], [3, 6], [0, 6],  // 4, 5, 6
  [0, 3],                   // 7
  // Middle square
  [1, 1], [3, 1], [5, 1],  // 8, 9, 10
  [5, 3],                   // 11
  [5, 5], [3, 5], [1, 5],  // 12, 13, 14
  [1, 3],                   // 15
  // Inner square
  [2, 2], [3, 2], [4, 2],  // 16, 17, 18
  [4, 3],                   // 19
  [4, 4], [3, 4], [2, 4],  // 20, 21, 22
  [2, 3],                   // 23
];

// Adjacency list for the 24-node board
export const ADJACENCY: number[][] = [
  /* 0 */  [1, 7],
  /* 1 */  [0, 2, 9],
  /* 2 */  [1, 3],
  /* 3 */  [2, 4, 11],
  /* 4 */  [3, 5],
  /* 5 */  [4, 6, 13],
  /* 6 */  [5, 7],
  /* 7 */  [6, 0, 15],
  /* 8 */  [9, 15],
  /* 9 */  [8, 10, 1, 17],
  /* 10 */ [9, 11],
  /* 11 */ [10, 12, 3, 19],
  /* 12 */ [11, 13],
  /* 13 */ [12, 14, 5, 21],
  /* 14 */ [13, 15],
  /* 15 */ [14, 8, 7, 23],
  /* 16 */ [17, 23],
  /* 17 */ [16, 18, 9],
  /* 18 */ [17, 19],
  /* 19 */ [18, 20, 11],
  /* 20 */ [19, 21],
  /* 21 */ [20, 22, 13],
  /* 22 */ [21, 23],
  /* 23 */ [22, 16, 15],
];

// Mills (lines of 3) - 16 total
export const MILLS: [number, number, number][] = [
  // Outer square (4 mills)
  [0, 1, 2],
  [2, 3, 4],
  [4, 5, 6],
  [6, 7, 0],
  // Middle square (4 mills)
  [8, 9, 10],
  [10, 11, 12],
  [12, 13, 14],
  [14, 15, 8],
  // Inner square (4 mills)
  [16, 17, 18],
  [18, 19, 20],
  [20, 21, 22],
  [22, 23, 16],
  // Radial lines (4 mills)
  [1, 9, 17],
  [3, 11, 19],
  [5, 13, 21],
  [7, 15, 23],
];

// Map each node to mills it belongs to (for quick lookup)
export const NODE_TO_MILLS: number[][] = [];
for (let i = 0; i < NODE_COUNT; i++) {
  NODE_TO_MILLS[i] = [];
  for (let m = 0; m < MILLS.length; m++) {
    if (MILLS[m].includes(i)) {
      NODE_TO_MILLS[i].push(m);
    }
  }
}

export interface AIConfig {
  maxDepth: number;
  timeLimit: number; // ms
}
