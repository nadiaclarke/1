// Tutorial Screen - Game rules and how to play

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle, Line, G } from 'react-native-svg';
import { RootStackParamList } from './GameScreen';

type TutorialScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tutorial'>;

interface TutorialScreenProps {
  navigation: TutorialScreenNavigationProp;
}

// Mini board for illustrations
const MiniBoard = ({ highlights = [], player1 = [], player2 = [] }: {
  highlights?: number[];
  player1?: number[];
  player2?: number[];
}) => {
  const SIZE = 120;
  const PADDING = 10;
  const CELL = (SIZE - 2 * PADDING) / 6;

  const positions: [number, number][] = [
    [0, 0], [3, 0], [6, 0],
    [6, 3],
    [6, 6], [3, 6], [0, 6],
    [0, 3],
    [1, 1], [3, 1], [5, 1],
    [5, 3],
    [5, 5], [3, 5], [1, 5],
    [1, 3],
    [2, 2], [3, 2], [4, 2],
    [4, 3],
    [4, 4], [3, 4], [2, 4],
    [2, 3],
  ];

  const getPos = (node: number) => ({
    x: PADDING + positions[node][0] * CELL,
    y: PADDING + positions[node][1] * CELL,
  });

  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
    [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 8],
    [16, 17], [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23], [23, 16],
    [1, 9], [9, 17], [3, 11], [11, 19], [5, 13], [13, 21], [7, 15], [15, 23],
  ];

  return (
    <Svg width={SIZE} height={SIZE}>
      {edges.map(([from, to], i) => {
        const p1 = getPos(from);
        const p2 = getPos(to);
        return (
          <Line
            key={i}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="#8B7355"
            strokeWidth={1}
          />
        );
      })}
      {positions.map((_, node) => {
        const pos = getPos(node);
        const isP1 = player1.includes(node);
        const isP2 = player2.includes(node);
        const isHighlight = highlights.includes(node);

        return (
          <G key={node}>
            {isHighlight && (
              <Circle cx={pos.x} cy={pos.y} r={8} fill="rgba(76, 175, 80, 0.3)" />
            )}
            <Circle
              cx={pos.x}
              cy={pos.y}
              r={6}
              fill={isP1 ? '#2E86AB' : isP2 ? '#E94F37' : '#D4C4A8'}
            />
          </G>
        );
      })}
    </Svg>
  );
};

const tutorialPages = [
  {
    title: 'Welcome to Loop Morris',
    content: 'Loop Morris is a strategic board game for two players. Your goal is to capture your opponent\'s pieces by forming "loops" - three of your pieces in a row.',
    board: { player1: [], player2: [], highlights: [] },
  },
  {
    title: 'The Board',
    content: 'The board has 24 positions arranged in 3 concentric squares, connected at the midpoints. Pieces can only move along the lines to adjacent positions.',
    board: { player1: [], player2: [], highlights: [1, 9, 17, 3, 11, 19, 5, 13, 21, 7, 15, 23] },
  },
  {
    title: 'Phase 1: Placement',
    content: 'Each player takes turns placing one ring at a time on any empty position. You each have 9 rings to place. The blue player goes first.',
    board: { player1: [0, 9, 5], player2: [4, 15, 17], highlights: [] },
  },
  {
    title: 'Forming a Loop',
    content: 'A "loop" is three of your rings in a straight line along the board edges. When you form a loop, you capture one opponent\'s ring!',
    board: { player1: [0, 1, 2], player2: [8, 12, 20], highlights: [0, 1, 2] },
  },
  {
    title: 'Capture Rules',
    content: 'When capturing, you cannot take a ring that is part of an opponent\'s loop - unless ALL their rings are in loops. Choose wisely!',
    board: { player1: [0, 1, 2, 9], player2: [8, 15, 14], highlights: [8, 15, 14] },
  },
  {
    title: 'Phase 2: Movement',
    content: 'After all 18 rings are placed, players take turns moving one ring at a time to an adjacent empty position along the lines.',
    board: { player1: [0, 1, 9, 17, 21], player2: [4, 11, 13, 15, 22], highlights: [2, 8] },
  },
  {
    title: 'Winning the Game',
    content: 'You win if:\n• Your opponent has only 2 rings left\n• Your opponent cannot make any legal moves\n\nGood luck and have fun!',
    board: { player1: [0, 1, 2, 9, 17, 21, 5], player2: [12, 20], highlights: [] },
  },
];

export function TutorialScreen({ navigation }: TutorialScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const page = tutorialPages[currentPage];
  const isFirst = currentPage === 0;
  const isLast = currentPage === tutorialPages.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>How to Play</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Page Title */}
        <Text style={styles.pageTitle}>{page.title}</Text>

        {/* Board Illustration */}
        <View style={styles.boardContainer}>
          <MiniBoard
            player1={page.board.player1}
            player2={page.board.player2}
            highlights={page.board.highlights}
          />
        </View>

        {/* Content */}
        <Text style={styles.pageContent}>{page.content}</Text>

        {/* Page Indicator */}
        <View style={styles.pageIndicator}>
          {tutorialPages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentPage && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, isFirst && styles.navButtonDisabled]}
          onPress={() => setCurrentPage(p => p - 1)}
          disabled={isFirst}
        >
          <Text style={[styles.navButtonText, isFirst && styles.navButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>

        {isLast ? (
          <TouchableOpacity
            style={[styles.navButton, styles.playButton]}
            onPress={() => navigation.navigate('Game', { mode: 'local' })}
          >
            <Text style={styles.playButtonText}>Start Playing</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentPage(p => p + 1)}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF9F3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#2E86AB',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  boardContainer: {
    backgroundColor: '#F5F0E6',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  pageContent: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  pageIndicator: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
  },
  dotActive: {
    backgroundColor: '#2E86AB',
    width: 24,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  navButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2E86AB',
    minWidth: 120,
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#DDD',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TutorialScreen;
