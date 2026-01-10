# Loop Morris

A strategic mobile board game inspired by Nine Men's Morris, built with React Native and Expo.

## Game Overview

Loop Morris is a two-player abstract strategy game where you compete to capture your opponent's pieces by forming "loops" - three of your pieces in a straight line.

## Rules

### Setup
- The board has 24 positions arranged in 3 concentric squares, connected at midpoints
- Each player has 9 rings to place

### Phase 1: Placement
- Players alternate placing one ring at a time on any empty position
- Continue until all 18 rings are placed (9 per player)

### Phase 2: Movement
- Players alternate moving one of their rings to an adjacent empty position
- Rings can only move along the lines connecting positions

### Forming a Loop (Capture)
- When you form a "loop" (3 of your rings in a straight line), you capture one opponent ring
- You cannot capture a ring that is part of an opponent's loop, unless ALL their rings are in loops

### Winning
You win if:
- Your opponent is reduced to 2 rings
- Your opponent has no legal moves

## Features

- **Local Pass-and-Play**: Two players on one device
- **AI Opponent**: Easy and Hard difficulty modes
- **Tutorial**: Step-by-step game instructions
- **Undo**: Undo your last move
- **Accessibility**:
  - Colorblind-safe palette option
  - Large tap targets
  - Haptic feedback (toggleable)
- **Legal Move Highlighting**: See available moves (toggleable)

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator, or Expo Go app on your device

### Setup

```bash
# Navigate to project directory
cd LoopMorris

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

```bash
# Run on iOS Simulator (macOS only)
npm run ios

# Run on Android Emulator
npm run android

# Run in web browser
npm run web
```

Or scan the QR code with Expo Go app on your phone.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
LoopMorris/
├── src/
│   ├── engine/
│   │   ├── gameEngine.ts    # Core game logic (pure functions)
│   │   └── aiEngine.ts      # AI with minimax + alpha-beta
│   ├── types/
│   │   └── game.ts          # TypeScript types and board data
│   ├── components/
│   │   └── Board.tsx        # SVG board rendering
│   ├── screens/
│   │   ├── HomeScreen.tsx   # Main menu
│   │   ├── GameScreen.tsx   # Game interface
│   │   ├── SettingsScreen.tsx
│   │   └── TutorialScreen.tsx
│   ├── hooks/
│   │   └── useGame.ts       # Game state management hook
│   └── utils/
│       └── SettingsContext.tsx
├── __tests__/
│   ├── gameEngine.test.ts   # Game engine unit tests
│   └── aiEngine.test.ts     # AI unit tests
├── App.tsx                  # App entry point
└── package.json
```

## Controls

### During Placement Phase
- Tap any empty position to place your ring

### During Movement Phase
- Tap one of your rings to select it
- Tap an adjacent empty position to move

### After Forming a Loop
- Tap an opponent's ring to capture it
- Highlighted rings show valid capture targets

## Settings

- **Highlight Legal Moves**: Show available moves when selecting
- **Haptic Feedback**: Vibration on actions
- **Color Scheme**: Default or Colorblind-safe palette

## Tech Stack

- React Native with Expo (managed workflow)
- TypeScript
- React Navigation
- react-native-svg for board rendering
- expo-haptics for haptic feedback
- Jest for testing

## Architecture

The game uses a clean separation between:
- **Game Engine**: Pure functions for game logic, move generation, and win detection
- **AI Engine**: Minimax with alpha-beta pruning, iterative deepening, and time limits
- **UI Layer**: React Native components consuming the engine via hooks

The AI uses:
- Depth-limited minimax (depth 4)
- Alpha-beta pruning for efficiency
- Iterative deepening with 180ms time limit
- Heuristic evaluation considering: piece count, mills, potential mills, mobility, center control

## License

MIT
