// Board Component - SVG rendering of the game board

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Svg, { Line, Circle, G } from 'react-native-svg';
import { GameState, NODE_POSITIONS, ADJACENCY, Player } from '../types/game';

interface BoardProps {
  state: GameState;
  onNodePress: (node: number) => void;
  selectedNode: number | null;
  highlightedNodes: Set<number>;
  capturableNodes: Set<number>;
  showLegalMoves: boolean;
  colorScheme: 'default' | 'colorblind';
}

// Grid settings
const GRID_SIZE = 7;
const PADDING = 30;
const BOARD_SIZE = 320;
const CELL_SIZE = (BOARD_SIZE - 2 * PADDING) / (GRID_SIZE - 1);

// Get pixel coordinates for a node
function getNodePosition(node: number): { x: number; y: number } {
  const [gx, gy] = NODE_POSITIONS[node];
  return {
    x: PADDING + gx * CELL_SIZE,
    y: PADDING + gy * CELL_SIZE,
  };
}

// Color schemes
const COLORS = {
  default: {
    board: '#F5F0E6',
    lines: '#8B7355',
    player1: '#2E86AB',
    player2: '#E94F37',
    empty: '#D4C4A8',
    selected: '#FFD700',
    highlight: 'rgba(76, 175, 80, 0.5)',
    capturable: 'rgba(255, 0, 0, 0.4)',
  },
  colorblind: {
    board: '#F5F0E6',
    lines: '#8B7355',
    player1: '#0072B2', // Blue
    player2: '#E69F00', // Orange
    empty: '#D4C4A8',
    selected: '#F0E442', // Yellow
    highlight: 'rgba(0, 158, 115, 0.5)', // Teal
    capturable: 'rgba(204, 121, 167, 0.5)', // Pink
  },
};

// Get unique edges for drawing (avoid duplicates)
function getEdges(): [number, number][] {
  const edges: [number, number][] = [];
  const seen = new Set<string>();

  for (let i = 0; i < ADJACENCY.length; i++) {
    for (const j of ADJACENCY[i]) {
      const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([i, j]);
      }
    }
  }
  return edges;
}

const EDGES = getEdges();

export const Board: React.FC<BoardProps> = ({
  state,
  onNodePress,
  selectedNode,
  highlightedNodes,
  capturableNodes,
  showLegalMoves,
  colorScheme,
}) => {
  const colors = COLORS[colorScheme];

  const renderEdges = () => {
    return EDGES.map(([from, to], index) => {
      const fromPos = getNodePosition(from);
      const toPos = getNodePosition(to);
      return (
        <Line
          key={`edge-${index}`}
          x1={fromPos.x}
          y1={fromPos.y}
          x2={toPos.x}
          y2={toPos.y}
          stroke={colors.lines}
          strokeWidth={2}
        />
      );
    });
  };

  const renderNodes = () => {
    return NODE_POSITIONS.map((_, node) => {
      const pos = getNodePosition(node);
      const cellState = state.board[node];
      const isSelected = selectedNode === node;
      const isHighlighted = showLegalMoves && highlightedNodes.has(node);
      const isCapturable = capturableNodes.has(node);

      // Node radius
      const radius = 18;

      // Determine fill color
      let fillColor = colors.empty;
      if (cellState === 1) fillColor = colors.player1;
      else if (cellState === 2) fillColor = colors.player2;

      // Stroke for selection
      let strokeColor = 'transparent';
      let strokeWidth = 0;
      if (isSelected) {
        strokeColor = colors.selected;
        strokeWidth = 4;
      } else if (isHighlighted) {
        strokeColor = colors.highlight.replace('0.5', '1');
        strokeWidth = 3;
      } else if (isCapturable) {
        strokeColor = colors.capturable.replace('0.4', '1').replace('0.5', '1');
        strokeWidth = 3;
      }

      return (
        <G key={`node-${node}`}>
          {/* Highlight circle behind */}
          {(isHighlighted || isCapturable) && (
            <Circle
              cx={pos.x}
              cy={pos.y}
              r={radius + 5}
              fill={isCapturable ? colors.capturable : colors.highlight}
            />
          )}
          {/* Main node */}
          <Circle
            cx={pos.x}
            cy={pos.y}
            r={radius}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          {/* Inner pattern for pieces */}
          {cellState !== 0 && (
            <Circle
              cx={pos.x}
              cy={pos.y}
              r={radius * 0.5}
              fill="transparent"
              stroke={cellState === 1 ? '#FFFFFF' : '#FFFFFF'}
              strokeWidth={2}
              opacity={0.6}
            />
          )}
        </G>
      );
    });
  };

  // Pressable overlay for touch handling
  const renderTouchAreas = () => {
    return NODE_POSITIONS.map((_, node) => {
      const pos = getNodePosition(node);
      const touchSize = 50; // Larger than visual for accessibility

      return (
        <Pressable
          key={`touch-${node}`}
          onPress={() => onNodePress(node)}
          style={[
            styles.touchArea,
            {
              left: pos.x - touchSize / 2,
              top: pos.y - touchSize / 2,
              width: touchSize,
              height: touchSize,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Node ${node}, ${
            state.board[node] === 0
              ? 'empty'
              : state.board[node] === 1
              ? 'Player 1'
              : 'Player 2'
          }`}
        />
      );
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.board }]}>
      <Svg width={BOARD_SIZE} height={BOARD_SIZE}>
        {renderEdges()}
        {renderNodes()}
      </Svg>
      <View style={styles.touchOverlay}>{renderTouchAreas()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    borderRadius: 8,
    position: 'relative',
  },
  touchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: BOARD_SIZE,
    height: BOARD_SIZE,
  },
  touchArea: {
    position: 'absolute',
    borderRadius: 25,
  },
});

export default Board;
