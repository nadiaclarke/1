// AI Engine - Minimax with Alpha-Beta Pruning

import {
  GameState,
  Player,
  Move,
  AIConfig,
  NODE_COUNT,
  ADJACENCY,
  MILLS,
} from '../types/game';

import {
  getLegalMoves,
  applyMove,
  cloneState,
  getOpponent,
  getPlayerMills,
  countMobility,
} from './gameEngine';

const DEFAULT_CONFIG: AIConfig = {
  maxDepth: 4,
  timeLimit: 180, // 180ms limit
};

// Central nodes are more valuable (connected to more mills)
const CENTER_NODES = new Set([1, 3, 5, 7, 9, 11, 13, 15]); // Midpoints

// Evaluate board position for a player
export function evaluatePosition(state: GameState, player: Player): number {
  if (state.winner === player) return 100000;
  if (state.winner === getOpponent(player)) return -100000;

  const opponent = getOpponent(player);
  let score = 0;

  // Piece count (most important)
  const myPieces = state.pieceCount[player - 1];
  const oppPieces = state.pieceCount[opponent - 1];
  score += (myPieces - oppPieces) * 100;

  // Pieces to place (in placement phase)
  const myToPlace = state.piecesToPlace[player - 1];
  const oppToPlace = state.piecesToPlace[opponent - 1];
  score += (myToPlace - oppToPlace) * 5;

  // Mill count
  const myMills = getPlayerMills(state.board, player).length;
  const oppMills = getPlayerMills(state.board, opponent).length;
  score += (myMills - oppMills) * 50;

  // Mobility (only in movement phase)
  if (state.phase === 'movement') {
    const myMobility = countMobility(state, player);
    const oppMobility = countMobility(state, opponent);
    score += (myMobility - oppMobility) * 10;
  }

  // Center control
  let myCenter = 0, oppCenter = 0;
  for (const node of CENTER_NODES) {
    if (state.board[node] === player) myCenter++;
    else if (state.board[node] === opponent) oppCenter++;
  }
  score += (myCenter - oppCenter) * 15;

  // Potential mills (two pieces in a mill line with third empty)
  const myPotential = countPotentialMills(state.board, player);
  const oppPotential = countPotentialMills(state.board, opponent);
  score += (myPotential - oppPotential) * 20;

  // Blocked mills (two pieces and opponent blocks third)
  const myBlocked = countBlockedMills(state.board, player, opponent);
  const oppBlocked = countBlockedMills(state.board, opponent, player);
  score += (oppBlocked - myBlocked) * 8; // Good to block opponent

  return score;
}

// Count potential mills (2 own pieces + 1 empty)
function countPotentialMills(board: number[], player: Player): number {
  let count = 0;
  for (const mill of MILLS) {
    let playerCount = 0;
    let emptyCount = 0;
    for (const node of mill) {
      if (board[node] === player) playerCount++;
      else if (board[node] === 0) emptyCount++;
    }
    if (playerCount === 2 && emptyCount === 1) count++;
  }
  return count;
}

// Count blocked mills (2 own pieces + 1 opponent)
function countBlockedMills(board: number[], player: Player, opponent: Player): number {
  let count = 0;
  for (const mill of MILLS) {
    let playerCount = 0;
    let oppCount = 0;
    for (const node of mill) {
      if (board[node] === player) playerCount++;
      else if (board[node] === opponent) oppCount++;
    }
    if (playerCount === 2 && oppCount === 1) count++;
  }
  return count;
}

// Order moves for better alpha-beta pruning
function orderMoves(state: GameState, moves: Move[]): Move[] {
  // Simple heuristic: prefer captures, then center placements/moves
  return [...moves].sort((a, b) => {
    // Captures first
    if (a.type === 'capture' && b.type !== 'capture') return -1;
    if (b.type === 'capture' && a.type !== 'capture') return 1;

    // Then center positions
    const getTargetNode = (m: Move): number => {
      if (m.type === 'place') return m.to;
      if (m.type === 'move') return m.to;
      return -1;
    };

    const aTarget = getTargetNode(a);
    const bTarget = getTargetNode(b);

    const aCenter = CENTER_NODES.has(aTarget) ? 1 : 0;
    const bCenter = CENTER_NODES.has(bTarget) ? 1 : 0;

    return bCenter - aCenter;
  });
}

// Minimax with alpha-beta pruning
function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: Player,
  startTime: number,
  timeLimit: number
): number {
  // Time check
  if (Date.now() - startTime > timeLimit) {
    return evaluatePosition(state, maximizingPlayer);
  }

  // Terminal state or depth limit
  if (depth === 0 || state.phase === 'gameOver') {
    return evaluatePosition(state, maximizingPlayer);
  }

  const moves = getLegalMoves(state);
  if (moves.length === 0) {
    return evaluatePosition(state, maximizingPlayer);
  }

  const orderedMoves = orderMoves(state, moves);
  const isMaximizing = state.currentPlayer === maximizingPlayer;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of orderedMoves) {
      try {
        const newState = applyMove(state, move);
        // If pending capture, it's still our turn
        const newDepth = newState.pendingCapture ? depth : depth - 1;
        const evalScore = minimax(newState, newDepth, alpha, beta, maximizingPlayer, startTime, timeLimit);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break; // Alpha cutoff
      } catch {
        continue;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of orderedMoves) {
      try {
        const newState = applyMove(state, move);
        const newDepth = newState.pendingCapture ? depth : depth - 1;
        const evalScore = minimax(newState, newDepth, alpha, beta, maximizingPlayer, startTime, timeLimit);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break; // Beta cutoff
      } catch {
        continue;
      }
    }
    return minEval;
  }
}

// Get best move for AI
export function getBestMove(state: GameState, config: AIConfig = DEFAULT_CONFIG): Move | null {
  const moves = getLegalMoves(state);
  if (moves.length === 0) return null;
  if (moves.length === 1) return moves[0];

  const startTime = Date.now();
  const orderedMoves = orderMoves(state, moves);

  let bestMove: Move = orderedMoves[0];
  let bestScore = -Infinity;

  // Iterative deepening
  for (let depth = 1; depth <= config.maxDepth; depth++) {
    if (Date.now() - startTime > config.timeLimit * 0.8) break;

    let depthBestMove = orderedMoves[0];
    let depthBestScore = -Infinity;

    for (const move of orderedMoves) {
      if (Date.now() - startTime > config.timeLimit) break;

      try {
        const newState = applyMove(state, move);
        const newDepth = newState.pendingCapture ? depth : depth - 1;
        const score = minimax(
          newState,
          newDepth,
          -Infinity,
          Infinity,
          state.currentPlayer,
          startTime,
          config.timeLimit
        );

        if (score > depthBestScore) {
          depthBestScore = score;
          depthBestMove = move;
        }
      } catch {
        continue;
      }
    }

    bestMove = depthBestMove;
    bestScore = depthBestScore;

    // If we found a winning move, stop searching
    if (bestScore > 50000) break;
  }

  return bestMove;
}

// Easy AI - random legal move with slight preference for mills
export function getEasyMove(state: GameState): Move | null {
  const moves = getLegalMoves(state);
  if (moves.length === 0) return null;

  // 50% chance to make a smart move
  if (Math.random() < 0.5) {
    // Try to find a mill-forming move
    for (const move of moves) {
      if (move.type === 'capture') return move;
    }
  }

  // Random move
  return moves[Math.floor(Math.random() * moves.length)];
}

export { DEFAULT_CONFIG };
