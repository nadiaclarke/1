// Game Engine - Pure Functions for Loop Morris

import {
  GameState,
  Player,
  CellState,
  Move,
  PlacementMove,
  MovementMove,
  CaptureMove,
  GamePhase,
  NODE_COUNT,
  PIECES_PER_PLAYER,
  ADJACENCY,
  MILLS,
  NODE_TO_MILLS,
} from '../types/game';

// Create initial game state
export function createInitialState(): GameState {
  return {
    board: new Array(NODE_COUNT).fill(0),
    currentPlayer: 1,
    phase: 'placement',
    piecesToPlace: [PIECES_PER_PLAYER, PIECES_PER_PLAYER],
    pieceCount: [0, 0],
    winner: null,
    pendingCapture: false,
    lastMove: null,
    moveHistory: [],
  };
}

// Deep clone game state
export function cloneState(state: GameState): GameState {
  return {
    ...state,
    board: [...state.board],
    piecesToPlace: [...state.piecesToPlace] as [number, number],
    pieceCount: [...state.pieceCount] as [number, number],
    moveHistory: [], // Don't clone history for performance in AI
  };
}

// Get opponent player
export function getOpponent(player: Player): Player {
  return player === 1 ? 2 : 1;
}

// Check if a node is occupied by a specific player
export function isOccupiedBy(board: CellState[], node: number, player: Player): boolean {
  return board[node] === player;
}

// Check if a node is empty
export function isEmpty(board: CellState[], node: number): boolean {
  return board[node] === 0;
}

// Check if placing/moving to a node forms a mill for the player
export function checkMillFormed(board: CellState[], node: number, player: Player): boolean {
  const relevantMills = NODE_TO_MILLS[node];
  for (const millIndex of relevantMills) {
    const mill = MILLS[millIndex];
    if (mill.every(n => board[n] === player)) {
      return true;
    }
  }
  return false;
}

// Get all mills a player currently has
export function getPlayerMills(board: CellState[], player: Player): number[][] {
  const mills: number[][] = [];
  for (const mill of MILLS) {
    if (mill.every(n => board[n] === player)) {
      mills.push([...mill]);
    }
  }
  return mills;
}

// Get all nodes that are part of a player's mills
export function getNodesInMills(board: CellState[], player: Player): Set<number> {
  const inMills = new Set<number>();
  for (const mill of MILLS) {
    if (mill.every(n => board[n] === player)) {
      mill.forEach(n => inMills.add(n));
    }
  }
  return inMills;
}

// Get valid capture targets for current player
export function getValidCaptureTargets(board: CellState[], opponent: Player): number[] {
  const opponentNodes = board
    .map((cell, i) => (cell === opponent ? i : -1))
    .filter(i => i >= 0);

  const nodesInMills = getNodesInMills(board, opponent);

  // Prefer nodes not in mills
  const notInMills = opponentNodes.filter(n => !nodesInMills.has(n));

  // If all opponent pieces are in mills, all are capturable
  if (notInMills.length === 0) {
    return opponentNodes;
  }

  return notInMills;
}

// Check if a capture target is valid
export function isValidCapture(board: CellState[], target: number, opponent: Player): boolean {
  if (board[target] !== opponent) return false;

  const validTargets = getValidCaptureTargets(board, opponent);
  return validTargets.includes(target);
}

// Get all legal placement moves
export function getPlacementMoves(state: GameState): PlacementMove[] {
  if (state.phase !== 'placement' || state.pendingCapture) return [];

  const moves: PlacementMove[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    if (isEmpty(state.board, i)) {
      moves.push({ type: 'place', to: i });
    }
  }
  return moves;
}

// Get all legal movement moves for current player
export function getMovementMoves(state: GameState): MovementMove[] {
  if (state.phase !== 'movement' || state.pendingCapture) return [];

  const moves: MovementMove[] = [];
  const player = state.currentPlayer;

  for (let from = 0; from < NODE_COUNT; from++) {
    if (state.board[from] === player) {
      for (const to of ADJACENCY[from]) {
        if (isEmpty(state.board, to)) {
          moves.push({ type: 'move', from, to });
        }
      }
    }
  }
  return moves;
}

// Get all legal capture moves
export function getCaptureMoves(state: GameState): CaptureMove[] {
  if (!state.pendingCapture) return [];

  const opponent = getOpponent(state.currentPlayer);
  const targets = getValidCaptureTargets(state.board, opponent);

  return targets.map(target => ({ type: 'capture', target }));
}

// Get all legal moves for current state
export function getLegalMoves(state: GameState): Move[] {
  if (state.phase === 'gameOver') return [];

  if (state.pendingCapture) {
    return getCaptureMoves(state);
  }

  if (state.phase === 'placement') {
    return getPlacementMoves(state);
  }

  return getMovementMoves(state);
}

// Check if player has any legal moves
export function hasLegalMoves(state: GameState): boolean {
  return getLegalMoves(state).length > 0;
}

// Check win conditions
export function checkWinner(state: GameState): Player | null {
  const opponent = getOpponent(state.currentPlayer);

  // Win if opponent reduced to 2 pieces (only check in movement phase)
  if (state.phase === 'movement') {
    if (state.pieceCount[0] <= 2) return 2;
    if (state.pieceCount[1] <= 2) return 1;
  }

  // Win if opponent has no legal moves (check after completing turn)
  const testState = cloneState(state);
  testState.currentPlayer = opponent;
  testState.pendingCapture = false;

  if (testState.phase === 'movement' && !hasLegalMoves(testState)) {
    return state.currentPlayer;
  }

  return null;
}

// Apply a move to the game state (returns new state)
export function applyMove(state: GameState, move: Move): GameState {
  const newState = cloneState(state);

  // Store previous state for undo (only keep last state)
  newState.moveHistory = [cloneState(state)];
  newState.lastMove = move;

  switch (move.type) {
    case 'place': {
      const { to } = move;
      if (!isEmpty(state.board, to)) {
        throw new Error(`Invalid placement: node ${to} is not empty`);
      }

      newState.board[to] = state.currentPlayer;
      newState.piecesToPlace[state.currentPlayer - 1]--;
      newState.pieceCount[state.currentPlayer - 1]++;

      // Check if mill formed
      if (checkMillFormed(newState.board, to, state.currentPlayer)) {
        const opponent = getOpponent(state.currentPlayer);
        const targets = getValidCaptureTargets(newState.board, opponent);
        if (targets.length > 0) {
          newState.pendingCapture = true;
        }
      }

      // Transition to movement phase if all pieces placed
      if (!newState.pendingCapture) {
        if (newState.piecesToPlace[0] === 0 && newState.piecesToPlace[1] === 0) {
          newState.phase = 'movement';
        }
        newState.currentPlayer = getOpponent(state.currentPlayer);
      }
      break;
    }

    case 'move': {
      const { from, to } = move;
      if (state.board[from] !== state.currentPlayer) {
        throw new Error(`Invalid move: no piece at node ${from}`);
      }
      if (!isEmpty(state.board, to)) {
        throw new Error(`Invalid move: node ${to} is not empty`);
      }
      if (!ADJACENCY[from].includes(to)) {
        throw new Error(`Invalid move: nodes ${from} and ${to} are not adjacent`);
      }

      newState.board[from] = 0;
      newState.board[to] = state.currentPlayer;

      // Check if mill formed
      if (checkMillFormed(newState.board, to, state.currentPlayer)) {
        const opponent = getOpponent(state.currentPlayer);
        const targets = getValidCaptureTargets(newState.board, opponent);
        if (targets.length > 0) {
          newState.pendingCapture = true;
        }
      }

      if (!newState.pendingCapture) {
        newState.currentPlayer = getOpponent(state.currentPlayer);
        // Check for winner
        const winner = checkWinner(newState);
        if (winner) {
          newState.winner = winner;
          newState.phase = 'gameOver';
        }
      }
      break;
    }

    case 'capture': {
      const { target } = move;
      const opponent = getOpponent(state.currentPlayer);

      if (!isValidCapture(state.board, target, opponent)) {
        throw new Error(`Invalid capture: node ${target}`);
      }

      newState.board[target] = 0;
      newState.pieceCount[opponent - 1]--;
      newState.pendingCapture = false;

      // Transition to movement phase if all pieces placed
      if (newState.piecesToPlace[0] === 0 && newState.piecesToPlace[1] === 0) {
        newState.phase = 'movement';
      }

      newState.currentPlayer = getOpponent(state.currentPlayer);

      // Check for winner
      const winner = checkWinner(newState);
      if (winner) {
        newState.winner = winner;
        newState.phase = 'gameOver';
      }
      break;
    }
  }

  return newState;
}

// Undo last move (returns previous state or null if no history)
export function undoMove(state: GameState): GameState | null {
  if (state.moveHistory.length === 0) return null;

  // Return the previous state
  const prevState = state.moveHistory[0];
  prevState.moveHistory = []; // Clear to allow another undo after moves
  return prevState;
}

// Check if move is legal
export function isLegalMove(state: GameState, move: Move): boolean {
  const legalMoves = getLegalMoves(state);

  switch (move.type) {
    case 'place':
      return legalMoves.some(m => m.type === 'place' && m.to === move.to);
    case 'move':
      return legalMoves.some(m => m.type === 'move' && m.from === move.from && m.to === move.to);
    case 'capture':
      return legalMoves.some(m => m.type === 'capture' && m.target === move.target);
    default:
      return false;
  }
}

// Get adjacent empty nodes for a given node
export function getAdjacentEmpty(board: CellState[], node: number): number[] {
  return ADJACENCY[node].filter(adj => isEmpty(board, adj));
}

// Count mobility (number of legal moves) for a player
export function countMobility(state: GameState, player: Player): number {
  let count = 0;
  for (let from = 0; from < NODE_COUNT; from++) {
    if (state.board[from] === player) {
      count += getAdjacentEmpty(state.board, from).length;
    }
  }
  return count;
}
