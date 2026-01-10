// useGame Hook - State management for the game

import { useState, useCallback, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import {
  GameState,
  Move,
  Player,
  PlacementMove,
  MovementMove,
  CaptureMove,
  ADJACENCY,
} from '../types/game';

import {
  createInitialState,
  applyMove,
  undoMove,
  getLegalMoves,
  getValidCaptureTargets,
  getOpponent,
  isEmpty,
} from '../engine/gameEngine';

import { getBestMove, getEasyMove } from '../engine/aiEngine';

export type GameMode = 'local' | 'ai';
export type AIDifficulty = 'easy' | 'hard';

interface UseGameOptions {
  mode: GameMode;
  aiDifficulty: AIDifficulty;
  playerSide?: Player; // Which side human plays in AI mode
  enableHaptics: boolean;
}

interface UseGameReturn {
  state: GameState;
  selectedNode: number | null;
  highlightedNodes: Set<number>;
  capturableNodes: Set<number>;
  message: string;
  handleNodePress: (node: number) => void;
  handleUndo: () => void;
  handleRestart: () => void;
  canUndo: boolean;
  isAIThinking: boolean;
}

export function useGame(options: UseGameOptions): UseGameReturn {
  const { mode, aiDifficulty, playerSide = 1, enableHaptics } = options;

  const [state, setState] = useState<GameState>(createInitialState);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<number>>(new Set());
  const [capturableNodes, setCapturableNodes] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState<string>('Player 1: Place a ring');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [previousState, setPreviousState] = useState<GameState | null>(null);

  const isAITurn = mode === 'ai' && state.currentPlayer !== playerSide && state.phase !== 'gameOver';

  // Trigger haptic feedback
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
    if (!enableHaptics) return;

    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  }, [enableHaptics]);

  // Update message based on game state
  const updateMessage = useCallback((newState: GameState) => {
    if (newState.phase === 'gameOver') {
      setMessage(`Player ${newState.winner} wins!`);
      return;
    }

    const playerName = mode === 'ai'
      ? (newState.currentPlayer === playerSide ? 'You' : 'AI')
      : `Player ${newState.currentPlayer}`;

    if (newState.pendingCapture) {
      setMessage(`${playerName}: Capture an opponent ring!`);
    } else if (newState.phase === 'placement') {
      setMessage(`${playerName}: Place a ring`);
    } else {
      setMessage(`${playerName}: Move a ring`);
    }
  }, [mode, playerSide]);

  // Update highlighted nodes based on selection
  const updateHighlights = useCallback((newState: GameState, selected: number | null) => {
    const highlights = new Set<number>();

    if (newState.pendingCapture) {
      // Show capturable nodes
      const targets = getValidCaptureTargets(newState.board, getOpponent(newState.currentPlayer));
      setCapturableNodes(new Set(targets));
      setHighlightedNodes(new Set());
      return;
    }

    setCapturableNodes(new Set());

    if (newState.phase === 'placement') {
      // Highlight all empty nodes
      for (let i = 0; i < newState.board.length; i++) {
        if (isEmpty(newState.board, i)) {
          highlights.add(i);
        }
      }
    } else if (newState.phase === 'movement' && selected !== null) {
      // Highlight adjacent empty nodes for selected piece
      for (const adj of ADJACENCY[selected]) {
        if (isEmpty(newState.board, adj)) {
          highlights.add(adj);
        }
      }
    }

    setHighlightedNodes(highlights);
  }, []);

  // Handle node press
  const handleNodePress = useCallback((node: number) => {
    if (state.phase === 'gameOver') return;
    if (isAITurn) return;

    const currentPlayer = state.currentPlayer;

    // Capture phase
    if (state.pendingCapture) {
      const opponent = getOpponent(currentPlayer);
      const targets = getValidCaptureTargets(state.board, opponent);

      if (targets.includes(node)) {
        triggerHaptic('success');
        const move: CaptureMove = { type: 'capture', target: node };
        const newState = applyMove(state, move);
        setPreviousState(state);
        setState(newState);
        setSelectedNode(null);
        updateMessage(newState);
        updateHighlights(newState, null);
      } else {
        triggerHaptic('error');
      }
      return;
    }

    // Placement phase
    if (state.phase === 'placement') {
      if (isEmpty(state.board, node)) {
        triggerHaptic('medium');
        const move: PlacementMove = { type: 'place', to: node };
        const newState = applyMove(state, move);
        setPreviousState(state);
        setState(newState);
        setSelectedNode(null);
        updateMessage(newState);
        updateHighlights(newState, null);
      } else {
        triggerHaptic('error');
      }
      return;
    }

    // Movement phase
    if (state.phase === 'movement') {
      // If clicking on own piece, select it
      if (state.board[node] === currentPlayer) {
        triggerHaptic('light');
        setSelectedNode(node);
        updateHighlights(state, node);
        return;
      }

      // If a piece is selected and clicking on adjacent empty node, move
      if (selectedNode !== null && isEmpty(state.board, node)) {
        if (ADJACENCY[selectedNode].includes(node)) {
          triggerHaptic('medium');
          const move: MovementMove = { type: 'move', from: selectedNode, to: node };
          const newState = applyMove(state, move);
          setPreviousState(state);
          setState(newState);
          setSelectedNode(null);
          updateMessage(newState);
          updateHighlights(newState, null);
        } else {
          triggerHaptic('error');
        }
        return;
      }

      // Deselect if clicking elsewhere
      if (selectedNode !== null) {
        setSelectedNode(null);
        updateHighlights(state, null);
      }
    }
  }, [state, selectedNode, isAITurn, triggerHaptic, updateMessage, updateHighlights]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (!previousState) return;

    triggerHaptic('light');
    setState(previousState);
    setPreviousState(null);
    setSelectedNode(null);
    updateMessage(previousState);
    updateHighlights(previousState, null);
  }, [previousState, triggerHaptic, updateMessage, updateHighlights]);

  // Handle restart
  const handleRestart = useCallback(() => {
    triggerHaptic('heavy');
    const newState = createInitialState();
    setState(newState);
    setPreviousState(null);
    setSelectedNode(null);
    updateMessage(newState);
    updateHighlights(newState, null);
  }, [triggerHaptic, updateMessage, updateHighlights]);

  // AI move effect
  useEffect(() => {
    if (!isAITurn || state.phase === 'gameOver') return;

    setIsAIThinking(true);

    // Use setTimeout to allow UI to update
    const timeoutId = setTimeout(() => {
      const aiMove = aiDifficulty === 'hard'
        ? getBestMove(state)
        : getEasyMove(state);

      if (aiMove) {
        const newState = applyMove(state, aiMove);
        setPreviousState(state);
        setState(newState);
        setSelectedNode(null);
        updateMessage(newState);
        updateHighlights(newState, null);

        if (aiMove.type === 'capture') {
          triggerHaptic('heavy');
        } else {
          triggerHaptic('medium');
        }
      }

      setIsAIThinking(false);
    }, 300); // Small delay for better UX

    return () => clearTimeout(timeoutId);
  }, [isAITurn, state, aiDifficulty, triggerHaptic, updateMessage, updateHighlights]);

  // Initial message setup
  useEffect(() => {
    updateMessage(state);
    updateHighlights(state, null);
  }, []);

  return {
    state,
    selectedNode,
    highlightedNodes,
    capturableNodes,
    message,
    handleNodePress,
    handleUndo,
    handleRestart,
    canUndo: previousState !== null && state.phase !== 'gameOver',
    isAIThinking,
  };
}

export default useGame;
