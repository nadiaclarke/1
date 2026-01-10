// Unit Tests for Game Engine

import {
  createInitialState,
  cloneState,
  getOpponent,
  isEmpty,
  isOccupiedBy,
  checkMillFormed,
  getPlayerMills,
  getNodesInMills,
  getValidCaptureTargets,
  isValidCapture,
  getPlacementMoves,
  getMovementMoves,
  getCaptureMoves,
  getLegalMoves,
  hasLegalMoves,
  checkWinner,
  applyMove,
  undoMove,
  isLegalMove,
  getAdjacentEmpty,
  countMobility,
} from '../src/engine/gameEngine';

import {
  GameState,
  Player,
  ADJACENCY,
  MILLS,
  NODE_COUNT,
} from '../src/types/game';

describe('Game Engine - Initialization', () => {
  test('createInitialState creates valid initial state', () => {
    const state = createInitialState();

    expect(state.board.length).toBe(NODE_COUNT);
    expect(state.board.every(cell => cell === 0)).toBe(true);
    expect(state.currentPlayer).toBe(1);
    expect(state.phase).toBe('placement');
    expect(state.piecesToPlace).toEqual([9, 9]);
    expect(state.pieceCount).toEqual([0, 0]);
    expect(state.winner).toBeNull();
    expect(state.pendingCapture).toBe(false);
  });

  test('cloneState creates independent copy', () => {
    const state = createInitialState();
    state.board[0] = 1;

    const clone = cloneState(state);
    clone.board[0] = 2;
    clone.board[1] = 2;

    expect(state.board[0]).toBe(1);
    expect(state.board[1]).toBe(0);
    expect(clone.board[0]).toBe(2);
  });
});

describe('Game Engine - Player Utilities', () => {
  test('getOpponent returns correct opponent', () => {
    expect(getOpponent(1)).toBe(2);
    expect(getOpponent(2)).toBe(1);
  });

  test('isEmpty correctly identifies empty nodes', () => {
    const state = createInitialState();
    state.board[0] = 1;

    expect(isEmpty(state.board, 0)).toBe(false);
    expect(isEmpty(state.board, 1)).toBe(true);
  });

  test('isOccupiedBy correctly identifies ownership', () => {
    const state = createInitialState();
    state.board[0] = 1;
    state.board[1] = 2;

    expect(isOccupiedBy(state.board, 0, 1)).toBe(true);
    expect(isOccupiedBy(state.board, 0, 2)).toBe(false);
    expect(isOccupiedBy(state.board, 1, 2)).toBe(true);
    expect(isOccupiedBy(state.board, 2, 1)).toBe(false);
  });
});

describe('Game Engine - Mill Detection', () => {
  test('checkMillFormed detects horizontal mill on outer square', () => {
    const state = createInitialState();
    state.board[0] = 1;
    state.board[1] = 1;
    state.board[2] = 1;

    expect(checkMillFormed(state.board, 0, 1)).toBe(true);
    expect(checkMillFormed(state.board, 1, 1)).toBe(true);
    expect(checkMillFormed(state.board, 2, 1)).toBe(true);
    expect(checkMillFormed(state.board, 0, 2)).toBe(false);
  });

  test('checkMillFormed detects radial mill', () => {
    const state = createInitialState();
    // Radial mill: 1, 9, 17
    state.board[1] = 2;
    state.board[9] = 2;
    state.board[17] = 2;

    expect(checkMillFormed(state.board, 1, 2)).toBe(true);
    expect(checkMillFormed(state.board, 9, 2)).toBe(true);
    expect(checkMillFormed(state.board, 17, 2)).toBe(true);
  });

  test('getPlayerMills returns all mills for a player', () => {
    const state = createInitialState();
    // Create two mills for player 1
    // Mill 1: 0, 1, 2
    state.board[0] = 1;
    state.board[1] = 1;
    state.board[2] = 1;
    // Mill 2: 2, 3, 4
    state.board[3] = 1;
    state.board[4] = 1;

    const mills = getPlayerMills(state.board, 1);
    expect(mills.length).toBe(2);
  });

  test('getNodesInMills returns correct nodes', () => {
    const state = createInitialState();
    state.board[0] = 1;
    state.board[1] = 1;
    state.board[2] = 1;

    const inMills = getNodesInMills(state.board, 1);
    expect(inMills.has(0)).toBe(true);
    expect(inMills.has(1)).toBe(true);
    expect(inMills.has(2)).toBe(true);
    expect(inMills.has(3)).toBe(false);
  });

  test('no mill detected for incomplete line', () => {
    const state = createInitialState();
    state.board[0] = 1;
    state.board[1] = 1;
    // Node 2 is empty

    expect(checkMillFormed(state.board, 0, 1)).toBe(false);
  });
});

describe('Game Engine - Capture Legality', () => {
  test('getValidCaptureTargets excludes pieces in mills', () => {
    const state = createInitialState();
    // Player 2 has a mill and one piece not in mill
    state.board[8] = 2;
    state.board[9] = 2;
    state.board[10] = 2; // Mill: 8, 9, 10
    state.board[16] = 2; // Not in a mill

    const targets = getValidCaptureTargets(state.board, 2);
    expect(targets).toEqual([16]);
  });

  test('all pieces capturable when all in mills', () => {
    const state = createInitialState();
    // Player 2 has only pieces in mills
    state.board[0] = 2;
    state.board[1] = 2;
    state.board[2] = 2;

    const targets = getValidCaptureTargets(state.board, 2);
    expect(targets).toContain(0);
    expect(targets).toContain(1);
    expect(targets).toContain(2);
  });

  test('isValidCapture validates correctly', () => {
    const state = createInitialState();
    state.board[0] = 2;
    state.board[1] = 2;
    state.board[2] = 2; // Mill
    state.board[16] = 2; // Not in mill

    expect(isValidCapture(state.board, 16, 2)).toBe(true);
    expect(isValidCapture(state.board, 0, 2)).toBe(false); // In mill
    expect(isValidCapture(state.board, 5, 2)).toBe(false); // Empty
    expect(isValidCapture(state.board, 16, 1)).toBe(false); // Wrong player
  });
});

describe('Game Engine - Move Generation', () => {
  test('getPlacementMoves returns all empty nodes in placement phase', () => {
    const state = createInitialState();
    state.board[0] = 1;
    state.board[5] = 2;

    const moves = getPlacementMoves(state);
    expect(moves.length).toBe(22); // 24 - 2
    expect(moves.every(m => m.type === 'place')).toBe(true);
    expect(moves.find(m => m.to === 0)).toBeUndefined();
    expect(moves.find(m => m.to === 5)).toBeUndefined();
  });

  test('getPlacementMoves returns empty when not in placement phase', () => {
    const state = createInitialState();
    state.phase = 'movement';

    expect(getPlacementMoves(state)).toEqual([]);
  });

  test('getMovementMoves returns valid adjacent moves', () => {
    const state = createInitialState();
    state.phase = 'movement';
    state.piecesToPlace = [0, 0];
    state.board[0] = 1;
    // Node 0 is adjacent to 1 and 7

    const moves = getMovementMoves(state);
    expect(moves.length).toBe(2);
    expect(moves.some(m => m.type === 'move' && m.from === 0 && m.to === 1)).toBe(true);
    expect(moves.some(m => m.type === 'move' && m.from === 0 && m.to === 7)).toBe(true);
  });

  test('getMovementMoves excludes blocked destinations', () => {
    const state = createInitialState();
    state.phase = 'movement';
    state.board[0] = 1;
    state.board[1] = 2; // Blocked

    const moves = getMovementMoves(state);
    expect(moves.some(m => m.to === 1)).toBe(false);
    expect(moves.some(m => m.to === 7)).toBe(true);
  });

  test('getCaptureMoves returns valid targets when pending capture', () => {
    const state = createInitialState();
    state.pendingCapture = true;
    state.board[5] = 2;
    state.board[10] = 2;

    const moves = getCaptureMoves(state);
    expect(moves.length).toBe(2);
    expect(moves.every(m => m.type === 'capture')).toBe(true);
  });

  test('getLegalMoves returns capture moves when pending', () => {
    const state = createInitialState();
    state.pendingCapture = true;
    state.board[5] = 2;

    const moves = getLegalMoves(state);
    expect(moves.every(m => m.type === 'capture')).toBe(true);
  });
});

describe('Game Engine - Apply Move', () => {
  test('placement move updates board and counters', () => {
    const state = createInitialState();
    const newState = applyMove(state, { type: 'place', to: 5 });

    expect(newState.board[5]).toBe(1);
    expect(newState.piecesToPlace[0]).toBe(8);
    expect(newState.pieceCount[0]).toBe(1);
    expect(newState.currentPlayer).toBe(2);
  });

  test('placement forming mill triggers capture phase', () => {
    const state = createInitialState();
    state.board[0] = 1;
    state.board[1] = 1;
    state.board[10] = 2; // Opponent piece to capture

    const newState = applyMove(state, { type: 'place', to: 2 });

    expect(newState.pendingCapture).toBe(true);
    expect(newState.currentPlayer).toBe(1); // Still player 1's turn
  });

  test('movement move updates board correctly', () => {
    const state = createInitialState();
    state.phase = 'movement';
    state.piecesToPlace = [0, 0];
    state.board[0] = 1;
    state.pieceCount = [1, 1];

    const newState = applyMove(state, { type: 'move', from: 0, to: 1 });

    expect(newState.board[0]).toBe(0);
    expect(newState.board[1]).toBe(1);
    expect(newState.currentPlayer).toBe(2);
  });

  test('capture move removes opponent piece', () => {
    const state = createInitialState();
    state.pendingCapture = true;
    state.board[5] = 2;
    state.pieceCount = [3, 4];

    const newState = applyMove(state, { type: 'capture', target: 5 });

    expect(newState.board[5]).toBe(0);
    expect(newState.pieceCount[1]).toBe(3);
    expect(newState.pendingCapture).toBe(false);
    expect(newState.currentPlayer).toBe(2);
  });

  test('invalid placement throws error', () => {
    const state = createInitialState();
    state.board[5] = 1;

    expect(() => applyMove(state, { type: 'place', to: 5 })).toThrow();
  });

  test('invalid movement throws error', () => {
    const state = createInitialState();
    state.phase = 'movement';
    state.board[0] = 2; // Wrong player

    expect(() => applyMove(state, { type: 'move', from: 0, to: 1 })).toThrow();
  });
});

describe('Game Engine - Win Detection', () => {
  test('player wins when opponent reduced to 2 pieces', () => {
    const state = createInitialState();
    state.phase = 'movement';
    state.pieceCount = [5, 2];
    state.currentPlayer = 1;

    const winner = checkWinner(state);
    expect(winner).toBe(1);
  });

  test('player wins when opponent has no moves', () => {
    const state = createInitialState();
    state.phase = 'movement';
    state.pieceCount = [5, 3];
    state.piecesToPlace = [0, 0];
    state.currentPlayer = 1;

    // Surround all of player 2's pieces
    state.board[16] = 2;
    state.board[17] = 1;
    state.board[23] = 1;

    state.board[18] = 2;
    state.board[19] = 1;
    // 17 already blocked

    state.board[20] = 2;
    state.board[21] = 1;
    // 19 already blocked

    const winner = checkWinner(state);
    expect(winner).toBe(1);
  });

  test('no winner when game continues', () => {
    const state = createInitialState();
    state.phase = 'movement';
    state.pieceCount = [5, 5];
    state.piecesToPlace = [0, 0];
    state.board[0] = 1;
    state.board[8] = 2;

    expect(checkWinner(state)).toBeNull();
  });
});

describe('Game Engine - Undo', () => {
  test('undoMove restores previous state', () => {
    const state = createInitialState();
    const newState = applyMove(state, { type: 'place', to: 5 });

    const undoneState = undoMove(newState);

    expect(undoneState).not.toBeNull();
    expect(undoneState!.board[5]).toBe(0);
    expect(undoneState!.currentPlayer).toBe(1);
    expect(undoneState!.piecesToPlace[0]).toBe(9);
  });

  test('undoMove returns null when no history', () => {
    const state = createInitialState();
    expect(undoMove(state)).toBeNull();
  });
});

describe('Game Engine - Move Validation', () => {
  test('isLegalMove validates placement', () => {
    const state = createInitialState();

    expect(isLegalMove(state, { type: 'place', to: 5 })).toBe(true);
    state.board[5] = 1;
    expect(isLegalMove(state, { type: 'place', to: 5 })).toBe(false);
  });

  test('isLegalMove validates movement', () => {
    const state = createInitialState();
    state.phase = 'movement';
    state.piecesToPlace = [0, 0];
    state.board[0] = 1;

    expect(isLegalMove(state, { type: 'move', from: 0, to: 1 })).toBe(true);
    expect(isLegalMove(state, { type: 'move', from: 0, to: 5 })).toBe(false); // Not adjacent
  });
});

describe('Game Engine - Board Data Integrity', () => {
  test('ADJACENCY is symmetric', () => {
    for (let i = 0; i < NODE_COUNT; i++) {
      for (const adj of ADJACENCY[i]) {
        expect(ADJACENCY[adj]).toContain(i);
      }
    }
  });

  test('MILLS have exactly 3 nodes each', () => {
    for (const mill of MILLS) {
      expect(mill.length).toBe(3);
    }
  });

  test('all MILLS nodes are valid', () => {
    for (const mill of MILLS) {
      for (const node of mill) {
        expect(node).toBeGreaterThanOrEqual(0);
        expect(node).toBeLessThan(NODE_COUNT);
      }
    }
  });

  test('there are 16 mills total', () => {
    expect(MILLS.length).toBe(16);
  });
});

describe('Game Engine - Phase Transitions', () => {
  test('transitions to movement phase after all pieces placed', () => {
    let state = createInitialState();

    // Place all 18 pieces (9 each)
    const positions = [0, 8, 1, 9, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15, 16, 17, 18, 19];
    for (const pos of positions) {
      if (state.phase === 'placement' && !state.pendingCapture) {
        state = applyMove(state, { type: 'place', to: pos });
        if (state.pendingCapture) {
          // Skip capture for simplicity, find a target
          const moves = getCaptureMoves(state);
          if (moves.length > 0) {
            state = applyMove(state, moves[0]);
          }
        }
      }
    }

    expect(state.piecesToPlace[0]).toBe(0);
    expect(state.piecesToPlace[1]).toBe(0);
    expect(state.phase).toBe('movement');
  });
});

describe('Game Engine - Mobility', () => {
  test('countMobility returns correct count', () => {
    const state = createInitialState();
    state.phase = 'movement';
    state.board[0] = 1; // Adjacent to 1, 7
    state.board[1] = 1; // Adjacent to 0(blocked), 2, 9

    const mobility = countMobility(state, 1);
    // Node 0: can go to 7 (1 is blocked)
    // Node 1: can go to 2, 9 (0 is blocked)
    expect(mobility).toBe(3);
  });

  test('getAdjacentEmpty returns correct nodes', () => {
    const state = createInitialState();
    state.board[0] = 1;
    state.board[1] = 2;

    const empty = getAdjacentEmpty(state.board, 0);
    expect(empty).toEqual([7]); // 1 is occupied
  });
});
