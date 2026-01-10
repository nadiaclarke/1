// Game Screen - Main game interface

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

import Board from '../components/Board';
import { useGame, GameMode, AIDifficulty } from '../hooks/useGame';
import { useSettings } from '../utils/SettingsContext';
import { Player } from '../types/game';

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Game: {
    mode: GameMode;
    aiDifficulty?: AIDifficulty;
    playerSide?: Player;
  };
  Settings: undefined;
  Tutorial: undefined;
};

type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

interface GameScreenProps {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
}

export function GameScreen({ navigation, route }: GameScreenProps) {
  const { mode, aiDifficulty = 'hard', playerSide = 1 } = route.params;
  const { settings } = useSettings();

  const {
    state,
    selectedNode,
    highlightedNodes,
    capturableNodes,
    message,
    handleNodePress,
    handleUndo,
    handleRestart,
    canUndo,
    isAIThinking,
  } = useGame({
    mode,
    aiDifficulty,
    playerSide,
    enableHaptics: settings.enableHaptics,
  });

  const isGameOver = state.phase === 'gameOver';

  // Player info display
  const renderPlayerInfo = (player: Player) => {
    const isCurrentPlayer = state.currentPlayer === player && !isGameOver;
    const piecesToPlace = state.piecesToPlace[player - 1];
    const piecesOnBoard = state.pieceCount[player - 1];
    const isWinner = state.winner === player;

    const playerColor = settings.colorScheme === 'colorblind'
      ? (player === 1 ? '#0072B2' : '#E69F00')
      : (player === 1 ? '#2E86AB' : '#E94F37');

    const playerName = mode === 'ai'
      ? (player === playerSide ? 'You' : 'AI')
      : `Player ${player}`;

    return (
      <View style={[
        styles.playerInfo,
        isCurrentPlayer && styles.activePlayer,
        isWinner && styles.winnerPlayer,
      ]}>
        <View style={[styles.playerDot, { backgroundColor: playerColor }]} />
        <Text style={styles.playerName}>{playerName}</Text>
        <View style={styles.pieceInfo}>
          {piecesToPlace > 0 && (
            <Text style={styles.pieceCount}>To place: {piecesToPlace}</Text>
          )}
          <Text style={styles.pieceCount}>On board: {piecesOnBoard}</Text>
        </View>
        {isWinner && <Text style={styles.winnerBadge}>WINNER!</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Loop Morris</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.headerButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Player 2 Info (top) */}
      {renderPlayerInfo(2)}

      {/* Game Board */}
      <View style={styles.boardContainer}>
        <Board
          state={state}
          onNodePress={handleNodePress}
          selectedNode={selectedNode}
          highlightedNodes={settings.showLegalMoves ? highlightedNodes : new Set()}
          capturableNodes={capturableNodes}
          showLegalMoves={settings.showLegalMoves}
          colorScheme={settings.colorScheme}
        />
        {isAIThinking && (
          <View style={styles.thinkingOverlay}>
            <ActivityIndicator size="large" color="#2E86AB" />
            <Text style={styles.thinkingText}>AI thinking...</Text>
          </View>
        )}
      </View>

      {/* Player 1 Info (bottom) */}
      {renderPlayerInfo(1)}

      {/* Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, !canUndo && styles.buttonDisabled]}
          onPress={handleUndo}
          disabled={!canUndo}
        >
          <Text style={[styles.buttonText, !canUndo && styles.buttonTextDisabled]}>
            Undo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.restartButton]}
          onPress={handleRestart}
        >
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
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
    paddingVertical: 8,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    color: '#2E86AB',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activePlayer: {
    borderColor: '#4CAF50',
    backgroundColor: '#F8FFF8',
  },
  winnerPlayer: {
    borderColor: '#FFD700',
    backgroundColor: '#FFFEF0',
  },
  playerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  pieceInfo: {
    alignItems: 'flex-end',
  },
  pieceCount: {
    fontSize: 12,
    color: '#666',
  },
  winnerBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  thinkingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  thinkingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  messageContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#2E86AB',
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
  },
  restartButton: {
    backgroundColor: '#E94F37',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#999',
  },
});

export default GameScreen;
