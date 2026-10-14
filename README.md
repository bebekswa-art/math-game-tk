# Permainan Matematika TK

An interactive math learning game for kindergarten children (ages 4-6), built with vanilla JavaScript, HTML, and CSS.

## Project Structure

```
.
├── index.html              # Entry point
├── css/
│   ├── reset.css          # CSS reset and normalization
│   ├── global.css         # Global theme, typography, buttons
│   ├── ui.css             # UI components (screens, cards, modals)
│   └── games.css          # Game-specific styles
├── js/
│   ├── main.js            # Application entry point with GameApp object
│   ├── state.js           # Game state management
│   ├── drag-engine.js     # Drag-and-drop engine
│   ├── ui-manager.js      # UI rendering and management
│   ├── scoring.js         # Scoring and progression logic
│   ├── audio-manager.js   # Sound effects and audio
│   └── games/
│       ├── base-game.js         # Base class for all games
│       ├── game1-hitung.js      # Game 1: Hitung & Kumpul (Counting)
│       ├── game2-bunga.js       # Game 2: Bunga ke Vas (Subtraction)
│       ├── game3-matching.js    # Game 3: Matching Angka (Number Matching)
│       ├── game4-puzzle.js      # Game 4: Puzzle Penjumlahan (Addition Puzzle)
│       └── game5-challenge.js   # Game 5: Challenge Mode (Mixed Operations)
├── data/
│   └── levels.json        # Level configuration (5 levels with parameters)
└── README.md              # This file

```

## Features

- **5 Progressive Levels**: Difficulty increases from easy to hard
- **Touch-Friendly**: All interactive elements are ≥44px touch targets
- **Responsive Design**: Works on mobile (320px+) and desktop devices
- **Accessible**: WCAG AA compliant with high contrast colors
- **Kindergarten-Friendly**: Bright, pastel color palette and simple navigation

## Color Palette

- Primary: #FFB6C1 (Light Pink)
- Secondary: #87CEEB (Sky Blue)
- Accent: #FFDAB9 (Peach)
- Success: #90EE90 (Light Green)
- Caution: #FFD700 (Gold)
- Background: #FFFAF0 (Floral White)

## Setup

1. Clone or download the project
2. Open `index.html` in a modern web browser
3. No build step or dependencies required

## Game Levels

| Level | Name | Type | Difficulty | Unlock | Questions |
|-------|------|------|-----------|--------|-----------|
| 1 | Hitung & Kumpul | Counting | Easy | 0 | 5 |
| 2 | Bunga ke Vas | Subtraction | Easy | 50 | 5 |
| 3 | Matching Angka | Number Matching | Medium | 80 | 5 |
| 4 | Puzzle Penjumlahan | Addition | Medium | 100 | 5 |
| 5 | Challenge Mode | Mixed Ops | Hard | 120 | 5 |

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Architecture

### GameApp Object

Main application object with methods:
- `init()` - Initialize the app and load level configuration
- `showScreen(name)` - Display a screen (home, levels, game, results)
- `startGame(level)` - Start a game at specified level

### Game Flow

1. Home Screen → Select Level → Play Game → Results
2. Each game validates answers and awards points
3. Unlock system prevents levels until score threshold is met
