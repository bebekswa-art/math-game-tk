# Math Game for TK Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully playable web-based educational math game with 5 drag-and-drop mini-games for kindergarten children, with progressive difficulty, scoring, and level progression.

**Architecture:** Single-page application (SPA) using Vanilla JavaScript with HTML5 Drag-and-Drop API. Game state managed in memory with LocalStorage persistence. Each mini-game is a self-contained module loaded by a central game controller. UI is screen-based (Title → Level Select → Game → Results).

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (ES6), HTML5 Drag-and-Drop API, LocalStorage for persistence, no external frameworks.

**Spec:** `D:\OC_NP2\docs\game-design-spec.md`

---

## Global Constraints

- Target audience: TK (ages 4-6); all UI elements ≥ 44px touch targets
- Text readable without zoom; high contrast (WCAG AA minimum)
- No time pressure in Levels 1-4; optional in Level 5
- All sounds optional (toggle mute button)
- Responsive design: works on mobile (320px+) and desktop
- All assets (images/sounds) embedded or CDN-served; no external API calls required
- Game progress persisted to LocalStorage (child name, highest level, scores)
- Drag-and-drop latency < 100ms; animations smooth 60 FPS target

---

## Review Focus

1. **Touch drag-and-drop accuracy on mobile:** Child drags object but it snaps to wrong location or doesn't register drop — test: drag object to drop zone on iOS/Android, verify snap precision and drop detection
2. **Level unlock logic correctness:** Child reaches score threshold but next level stays locked, or unlocks prematurely — test: mock score thresholds, verify unlock triggers at exact boundary values (50, 80, 100, 120 points)
3. **Drag over inactive zones:** Child drags object over UI element or off-screen; expect no visual corruption or event capture — test: drag object across buttons, off-canvas; verify no z-order issues or stuck states
4. **Audio playback timing:** Sound plays late or overlaps with rapid-fire actions — test: rapid correct/wrong clicks, verify audio queue or throttling prevents overlap
5. **State corruption on page reload:** Child mid-game, page reloads; expect game to restore state, not lose progress — test: save state to LocalStorage during game, reload page, verify state loads correctly

---

## File Structure

```
/
├── index.html                    # Single entry point
├── css/
│   ├── reset.css               # Normalize browser defaults
│   ├── global.css              # Layout, typography, theme colors
│   ├── ui.css                  # Screen layouts (title, level-select, game, results)
│   └── games.css               # Game-specific styling (drag states, animations)
├── js/
│   ├── main.js                 # App initialization, screen navigation
│   ├── state.js                # Game state object, LocalStorage sync
│   ├── drag-engine.js          # Drag-and-drop logic, event handlers
│   ├── ui-manager.js           # Render screens (DOM manipulation)
│   ├── scoring.js              # Score calculation, level unlock logic
│   ├── games/
│   │   ├── base-game.js        # Abstract base class for all games
│   │   ├── game1-hitung.js     # "Hitung & Kumpul"
│   │   ├── game2-bunga.js      # "Bunga ke Vas"
│   │   ├── game3-matching.js   # "Matching Angka"
│   │   ├── game4-puzzle.js     # "Puzzle Penjumlahan"
│   │   └── game5-challenge.js  # "Challenge Mode"
│   └── audio-manager.js        # Sound loading, playback, mute toggle
├── assets/
│   ├── images/
│   │   ├── sprites.png         # All game objects (placeholder)
│   │   ├── mascot.png          # Mascot character
│   │   ├── backgrounds/        # Scene backgrounds
│   │   └── ui-elements/        # Buttons, icons, etc
│   ├── sounds/
│   │   ├── bg-music.mp3        # Looping background music
│   │   ├── drop.mp3            # Drag drop sound
│   │   ├── correct.mp3         # Correct answer sound
│   │   ├── wrong.mp3           # Wrong answer sound
│   │   └── level-complete.mp3  # Level completion fanfare
│   └── fonts/
│       └── kid-friendly.ttf    # Custom font (optional)
├── data/
│   └── levels.json             # Level config (soal ranges, unlock thresholds)
└── README.md                   # Setup & deployment instructions
```

---

## Task Breakdown

### Task 1: Project Setup & HTML Structure

**Files:**
- Create: `index.html`
- Create: `css/reset.css`
- Create: `css/global.css`
- Create: `js/main.js`
- Create: `data/levels.json`
- Create: `README.md`

**Interfaces:**
- Produces: `window.GameApp` global object with methods `init()`, `showScreen(name)`, `startGame(level)`

- [ ] **Step 1: Create `index.html` with semantic structure**

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Permainan Matematika TK</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/ui.css">
  <link rel="stylesheet" href="css/games.css">
</head>
<body>
  <div id="app-container">
    <!-- Screens will be rendered here -->
  </div>
  <script src="js/state.js"></script>
  <script src="js/drag-engine.js"></script>
  <script src="js/ui-manager.js"></script>
  <script src="js/scoring.js"></script>
  <script src="js/audio-manager.js"></script>
  <script src="js/games/base-game.js"></script>
  <script src="js/games/game1-hitung.js"></script>
  <script src="js/games/game2-bunga.js"></script>
  <script src="js/games/game3-matching.js"></script>
  <script src="js/games/game4-puzzle.js"></script>
  <script src="js/games/game5-challenge.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `css/reset.css`**

Normalize across browsers (remove default margins, set box-sizing, etc). Use standard CSS reset (e.g., based on Normalize.css pattern).

- [ ] **Step 3: Create `css/global.css` with theme**

Define color palette (pastels), typography, button styles, responsive breakpoints. No screen-specific layout yet.

```css
:root {
  --primary: #FFB6C1;
  --secondary: #87CEEB;
  --accent: #FFDAB9;
  --success: #90EE90;
  --caution: #FFD700;
  --bg: #FFFAF0;
  --text: #333;
  /* ... other vars ... */
}
```

- [ ] **Step 4: Create `data/levels.json`**

```json
{
  "levels": [
    {
      "id": 1,
      "name": "Hitung & Kumpul",
      "game": "hitung",
      "difficulty": "easy",
      "unlockThreshold": 0,
      "soalCount": 5,
      "params": { "maxSum": 5 }
    },
    {
      "id": 2,
      "name": "Bunga ke Vas",
      "game": "bunga",
      "difficulty": "easy",
      "unlockThreshold": 50,
      "soalCount": 5,
      "params": { "maxTotal": 5, "maxRemove": 2 }
    },
    ...
  ]
}
```

- [ ] **Step 5: Create `js/main.js` entry point**

```javascript
window.GameApp = {
  currentScreen: null,
  gameState: null,
  
  init() {
    // Load state from LocalStorage
    this.gameState = GameState.load();
    // Show title screen
    this.showScreen('title');
  },
  
  showScreen(name) {
    // Render appropriate screen
    UIManager.render(name, this.gameState);
    this.currentScreen = name;
  },
  
  startGame(levelId) {
    // Load game module and initialize
    const level = this.gameState.getLevelConfig(levelId);
    // ... game initialization
  }
};

window.addEventListener('DOMContentLoaded', () => GameApp.init());
```

- [ ] **Step 6: Create `README.md`**

Include setup instructions, file structure overview, how to customize assets/soal, deployment notes.

- [ ] **Step 7: Verify `index.html` loads without errors in browser**

Run: Open `index.html` in browser, check console for errors
Expected: No JS errors, app initializes, title screen renders

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: project setup with HTML structure and theme"
```

---

### Task 2: Game State Management & LocalStorage

**Files:**
- Create: `js/state.js`
- Test: Manual verification of state persistence

**Interfaces:**
- Produces: `GameState` object with:
  - `GameState.load()` → returns game state from LocalStorage or defaults
  - `gameState.save()` → persists state to LocalStorage
  - `gameState.getLevelConfig(levelId)` → returns level configuration
  - `gameState.updateScore(points)` → adds points, updates highest level
  - `gameState.getUnlockedLevels()` → returns array of unlocked level IDs

- [ ] **Step 1: Create `js/state.js` with default structure**

```javascript
const GameState = {
  load() {
    const stored = localStorage.getItem('mathgame_state');
    return stored ? JSON.parse(stored) : this.defaults();
  },
  
  defaults() {
    return {
      childName: 'Anak',
      totalScore: 0,
      highestLevel: 1,
      levelScores: { 1: 0 },
      currentLevel: 1,
      currentGameState: null,
      lastPlayed: new Date().toISOString()
    };
  },
  
  save() {
    localStorage.setItem('mathgame_state', JSON.stringify(this));
  },
  
  // ... other methods ...
};
```

- [ ] **Step 2: Implement `getLevelConfig(levelId)` method**

Load level config from `data/levels.json` on first call, cache in memory.

- [ ] **Step 3: Implement `updateScore(points)` method**

Add `points` to `totalScore`, check if `highestLevel` should increment based on unlock thresholds from levels.json.

- [ ] **Step 4: Implement `getUnlockedLevels()` method**

Return array of level IDs where `totalScore >= unlockThreshold`.

- [ ] **Step 5: Test state persistence manually**

- Open game, enter name (Budi), start level 1
- Refresh page
- Verify state restored (name still Budi, level still 1)
- Commit state mid-game, refresh again, verify state restored

Expected: All state restored correctly across page reloads

- [ ] **Step 6: Commit**

```bash
git add js/state.js
git commit -m "feat: game state management with LocalStorage persistence"
```

---

### Task 3: Drag-and-Drop Engine

**Files:**
- Create: `js/drag-engine.js`
- Create: `css/games.css` (drag states)
- Test: Manual drag tests

**Interfaces:**
- Produces: `DragEngine` object with:
  - `DragEngine.init()` → attach drag listeners to document
  - `DragEngine.setDragData(element, data)` → mark element as draggable with metadata
  - `DragEngine.setDropZone(element, onDrop)` → register drop zone with callback
  - `DragEngine.onDrop(callback)` → triggered on successful drop with `{source, target, data}`

- [ ] **Step 1: Create `js/drag-engine.js` with event handlers**

Use HTML5 Drag-and-Drop API. Listen for `dragstart`, `dragover`, `drop` events.

```javascript
const DragEngine = {
  draggedElement: null,
  dropZones: [],
  
  init() {
    document.addEventListener('dragstart', (e) => this.handleDragStart(e));
    document.addEventListener('dragover', (e) => this.handleDragOver(e));
    document.addEventListener('drop', (e) => this.handleDrop(e));
    document.addEventListener('dragend', (e) => this.handleDragEnd(e));
  },
  
  handleDragStart(e) {
    this.draggedElement = e.target;
    e.dataTransfer.effectAllowed = 'move';
  },
  
  // ... other handlers ...
};
```

- [ ] **Step 2: Implement drag visual states in `css/games.css`**

```css
.draggable {
  cursor: grab;
  user-select: none;
}

.dragging {
  opacity: 0.6;
  cursor: grabbing;
}

.drop-zone {
  position: relative;
}

.drop-zone.drop-active {
  background-color: rgba(144, 238, 144, 0.3);
  border: 2px dashed #90EE90;
}
```

- [ ] **Step 3: Implement `setDragData(element, data)` method**

Attach `data-drag-id` and `data-drag-type` attributes to element.

- [ ] **Step 4: Implement `setDropZone(element, onDrop)` method**

Store element and callback in `dropZones` array.

- [ ] **Step 5: Implement drop validation and callback**

On drop, check if drop zone is valid, call `onDrop` callback with `{source, target, data}`.

- [ ] **Step 6: Test drag-and-drop manually**

- Create test HTML with draggable apel image and drop zone (basket)
- Drag apel to basket on desktop
- Verify visual feedback (hover highlight, drag opacity)
- Verify drop callback fires with correct data
- Test on mobile/touch device if possible (may require pointer events polyfill)

Expected: Smooth drag feedback, drop detected, callback triggered

- [ ] **Step 7: Commit**

```bash
git add js/drag-engine.js css/games.css
git commit -m "feat: HTML5 drag-and-drop engine with visual feedback"
```

---

### Task 4: UI Manager & Screen Navigation

**Files:**
- Create: `js/ui-manager.js`
- Create: `css/ui.css` (screen layouts)

**Interfaces:**
- Consumes: `GameState`, `GameApp`
- Produces: `UIManager.render(screenName, state)` → renders screen to DOM

- [ ] **Step 1: Create `css/ui.css` with screen layouts**

Define layouts for: title screen, level select, game screen, results screen.
Use CSS Grid or Flexbox for responsive layout.

- [ ] **Step 2: Create screen templates (HTML strings) in `js/ui-manager.js`**

```javascript
const screens = {
  title: (state) => `
    <div class="screen title-screen">
      <h1>Permainan Matematika</h1>
      <img src="assets/images/mascot.png" alt="Mascot">
      <button id="btn-start" class="btn-large">Mulai</button>
    </div>
  `,
  
  levelSelect: (state) => `
    <div class="screen level-select">
      <h2>Pilih Level</h2>
      ${state.getUnlockedLevels().map(lvl => /* level button HTML */).join('')}
    </div>
  `,
  
  // ... game, results screens ...
};
```

- [ ] **Step 3: Implement `UIManager.render(screenName, state)` method**

- Get template for screen
- Clear `#app-container`
- Render template
- Attach event listeners (buttons, mute toggle, etc)

- [ ] **Step 4: Create title screen**

Display mascot, "Mulai" button. On click, prompt for child name (optional), go to level select.

- [ ] **Step 5: Create level select screen**

Display levels 1-5 with lock/unlock status, score, progress bar. Show current score. Click level → start game.

- [ ] **Step 6: Create game screen layout (HUD)**

Template for: level indicator, score counter, hint button, sound toggle, game area (where mini-game will render), progress bar.

- [ ] **Step 7: Create results screen**

Display correct/wrong feedback, points awarded, stars (1-3), "Next" / "Ulang" buttons.

- [ ] **Step 8: Test navigation**

- Click "Mulai" → level select appears
- Click level 1 → game screen appears (empty game area for now)
- Verify all buttons interactive

Expected: Screen navigation works, layout responsive on mobile

- [ ] **Step 9: Commit**

```bash
git add js/ui-manager.js css/ui.css
git commit -m "feat: UI manager and screen navigation (title, level select, game, results)"
```

---

### Task 5: Scoring & Level Progression Logic

**Files:**
- Create: `js/scoring.js`
- Test: Unit tests or manual verification

**Interfaces:**
- Consumes: `GameState`, `levels.json`
- Produces: `Scoring` object with:
  - `Scoring.calculatePoints(correct, streak, speed)` → returns points (base + bonuses)
  - `Scoring.checkLevelUnlock(totalScore)` → returns highest unlocked level
  - `Scoring.submitAnswer(levelId, isCorrect, responseTimeMs)` → updates state, returns result

- [ ] **Step 1: Create `js/scoring.js` with point calculation**

```javascript
const Scoring = {
  calculatePoints(correct, streak, speed) {
    if (!correct) return 0;
    let points = 10; // Base
    points += Math.min(streak * 2, 20); // Streak bonus (max +20)
    if (speed < 10000) points += 5; // Speed bonus (< 10 seconds)
    return points;
  },
  
  // ... other methods ...
};
```

- [ ] **Step 2: Implement `checkLevelUnlock(totalScore)` method**

- Load thresholds from `levels.json`
- Return highest level ID where `totalScore >= unlockThreshold`

- [ ] **Step 3: Implement `submitAnswer(levelId, isCorrect, responseTimeMs)` method**

- Calculate points
- Update `gameState.levelScores[levelId]`
- Update `gameState.totalScore`
- Check for level unlock
- Return `{ correct, points, levelUnlocked }`

- [ ] **Step 4: Test scoring manually**

- Submit correct answer → verify points > 0
- Submit wrong answer → verify points = 0
- Build up score to 50 → verify level 2 unlocks
- Build to 80, 100, 120 → verify levels 3, 4, 5 unlock

Expected: Scoring and unlock logic matches spec exactly

- [ ] **Step 5: Commit**

```bash
git add js/scoring.js
git commit -m "feat: scoring system with level unlock logic"
```

---

### Task 6: Base Game Class & Game 1 (Hitung & Kumpul)

**Files:**
- Create: `js/games/base-game.js`
- Create: `js/games/game1-hitung.js`
- Create: `css/games.css` (Game 1 styles)

**Interfaces:**
- Consumes: `DragEngine`, `GameState`, `Scoring`
- Produces: `BaseGame` class with `init(container, levelConfig)`, `start()`, methods
- Produces: `Game1Hitung` extending `BaseGame` with game-specific logic

- [ ] **Step 1: Create `js/games/base-game.js` abstract class**

```javascript
class BaseGame {
  constructor(levelId) {
    this.levelId = levelId;
    this.soalIndex = 0;
    this.soals = [];
    this.streak = 0;
  }
  
  async init(container, config) {
    this.container = container;
    this.config = config;
    await this.generateSoals(); // Override in subclass
  }
  
  async generateSoals() {
    throw new Error('generateSoals must be implemented');
  }
  
  renderSoal(soal) {
    throw new Error('renderSoal must be implemented');
  }
  
  // Common methods for score tracking, soal progression, etc
}
```

- [ ] **Step 2: Create `js/games/game1-hitung.js` (Hitung & Kumpul)**

```javascript
class Game1Hitung extends BaseGame {
  constructor(levelId) {
    super(levelId);
    this.gameType = 'hitung';
  }
  
  generateSoals() {
    const maxSum = this.config.params.maxSum;
    const count = this.config.soalCount || 5;
    this.soals = [];
    for (let i = 0; i < count; i++) {
      const a = Math.floor(Math.random() * maxSum) + 1;
      const b = Math.floor(Math.random() * (maxSum - a)) + 1;
      this.soals.push({ a, b, answer: a + b });
    }
  }
  
  renderSoal(soal) {
    // HTML: "Kumpulkan ${a} apel + ${b} apel"
    // Render apple objects on screen
    // Render basket drop zone
    // Attach drag listeners
  }
  
  async onDrop(source, target, data) {
    // Validate: count dragged apel
    // Check if total matches soal.answer
    // Call scoreAndAdvance()
  }
}
```

- [ ] **Step 3: Implement `renderSoal()` for Game 1**

- Render question text: "Kumpulkan 3 apel + 2 apel"
- Render 3 apel objects (drag-enabled)
- Render 2 more apel objects (drag-enabled)
- Render basket drop zone
- Setup drag listeners

- [ ] **Step 4: Implement drop validation for Game 1**

- On drop into basket, count apel objects in basket
- Compare count to expected sum
- If correct, trigger success animation, advance to next soal
- If wrong, show "Coba lagi" and reset apel to original positions

- [ ] **Step 5: Add CSS for Game 1**

- Apple sprite positioning
- Basket styling
- Drop zone highlight
- Animation for success/failure

- [ ] **Step 6: Test Game 1 manually**

- Start level 1, game should initialize
- Drag apel into basket
- Verify soal progression
- Verify scoring on completion

Expected: Game 1 fully playable, drag feedback smooth, scoring correct

- [ ] **Step 7: Commit**

```bash
git add js/games/base-game.js js/games/game1-hitung.js css/games.css
git commit -m "feat: base game class and game 1 (hitung & kumpul)"
```

---

### Task 7: Game 2-4 Implementation (Bunga ke Vas, Matching Angka, Puzzle Penjumlahan)

**Files:**
- Create: `js/games/game2-bunga.js`
- Create: `js/games/game3-matching.js`
- Create: `js/games/game4-puzzle.js`
- Modify: `css/games.css` (add styles for each game)

**Interfaces:**
- Consumes: `BaseGame`, `DragEngine`, `Scoring`
- Produces: Three game classes extending `BaseGame` with specific logic

- [ ] **Step 1: Implement Game 2 (Bunga ke Vas) - Subtraction**

```javascript
class Game2Bunga extends BaseGame {
  generateSoals() {
    // Generate: { total: 5, remove: 2, answer: 3 }
  }
  
  renderSoal(soal) {
    // Render soal.total bunga in vas
    // User drags soal.remove out
    // Validate remaining count
  }
}
```

- [ ] **Step 2: Implement Game 3 (Matching Angka) - Number Recognition**

```javascript
class Game3Matching extends BaseGame {
  generateSoals() {
    // Generate: { number: 3, objectCount: 3 }
    // Soal: match number to quantity
  }
  
  renderSoal(soal) {
    // Left: Numbers 1-6
    // Right: Object groups (3 apel, 5 buku, etc)
    // Drag number to matching group
  }
}
```

- [ ] **Step 3: Implement Game 4 (Puzzle Penjumlahan) - Addition with Multiple Choice**

```javascript
class Game4Puzzle extends BaseGame {
  generateSoals() {
    // Generate: { a: 2, b: 3, answer: 5 }
  }
  
  renderSoal(soal) {
    // Show: "2 batu + 3 batu = ?"
    // Render 2 stone objects
    // Render 3 stone objects
    // Drag stones into target circle
    // Show 3 answer buttons (5, 6, 4)
    // User clicks correct answer
  }
}
```

- [ ] **Step 4: Add CSS for each game**

Sprites, positioning, button styles, animations.

- [ ] **Step 5: Test Games 2-4 individually**

- Play each game end-to-end
- Verify soal generation matches spec (ranges, difficulty)
- Verify drop validation logic
- Verify answer selection (Game 4)

Expected: All three games playable, mechanics smooth, scoring correct

- [ ] **Step 6: Commit**

```bash
git add js/games/game2-bunga.js js/games/game3-matching.js js/games/game4-puzzle.js css/games.css
git commit -m "feat: games 2-4 (bunga, matching, puzzle)"
```

---

### Task 8: Game 5 Implementation (Challenge Mode) & Game Launcher

**Files:**
- Create: `js/games/game5-challenge.js`
- Modify: `js/main.js` (add game launcher logic)
- Modify: `js/ui-manager.js` (connect game to UI)

**Interfaces:**
- Consumes: `BaseGame`, `Scoring`, `GameState`
- Produces: `Game5Challenge` class, game launcher in `main.js`

- [ ] **Step 1: Implement Game 5 (Challenge Mode) - Mixed Operations**

```javascript
class Game5Challenge extends BaseGame {
  generateSoals() {
    // Generate mix of addition & subtraction
    // Range: 1-10 operands
    // 5 consecutive correct = win
  }
  
  renderSoal(soal) {
    // Similar to Game 4: show equation, objects, multiple choice
  }
}
```

- [ ] **Step 2: Implement `startGame(levelId)` in `js/main.js`**

```javascript
async startGame(levelId) {
  const levelConfig = this.gameState.getLevelConfig(levelId);
  const gameClass = this.getGameClass(levelConfig.game);
  const game = new gameClass(levelId);
  
  const gameContainer = document.getElementById('game-area');
  await game.init(gameContainer, levelConfig);
  await game.start();
}
```

- [ ] **Step 3: Implement `getGameClass(gameName)` method**

Return appropriate game class (Game1Hitung, Game2Bunga, etc) based on name.

- [ ] **Step 4: Integrate game completion callback**

When game finishes (all soals done), call `completeGame()`:
- Calculate final score
- Update state via `Scoring.submitAnswer()`
- Show results screen
- Offer "Next Level" or "Ulang Level"

- [ ] **Step 5: Test Challenge Mode**

- Start level 5
- Complete 5 consecutive correct answers
- Verify win detection and celebration animation

Expected: Challenge mode works, can win with streak

- [ ] **Step 6: Test level progression end-to-end**

- Complete level 1 → level 2 unlocks
- Complete 2, 3, 4 → 5 unlocks
- Verify unlock logic throughout

Expected: Full progression works smoothly

- [ ] **Step 7: Commit**

```bash
git add js/games/game5-challenge.js js/main.js js/ui-manager.js
git commit -m "feat: game 5 (challenge mode) and game launcher"
```

---

### Task 9: Audio Manager & Sound Effects

**Files:**
- Create: `js/audio-manager.js`
- Create: `assets/sounds/` (placeholder audio files or data URLs)

**Interfaces:**
- Produces: `AudioManager` object with:
  - `AudioManager.init()` → preload sounds
  - `AudioManager.play(soundName)` → play sound (throttled)
  - `AudioManager.toggleMute()` → mute/unmute all
  - `AudioManager.isMuted()` → return mute state

- [ ] **Step 1: Create `js/audio-manager.js` with Web Audio API**

```javascript
const AudioManager = {
  sounds: {},
  muted: false,
  lastPlayTime: {},
  
  async init() {
    // Load sounds from assets/sounds/
    // Create Audio objects or use Web Audio API
  },
  
  play(soundName) {
    if (this.muted) return;
    // Throttle rapid sounds (no overlap)
    const now = Date.now();
    const lastTime = this.lastPlayTime[soundName] || 0;
    if (now - lastTime < 200) return; // 200ms throttle
    
    this.sounds[soundName].play();
    this.lastPlayTime[soundName] = now;
  },
  
  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('mathgame_muted', this.muted);
  },
  
  isMuted() {
    return this.muted;
  }
};
```

- [ ] **Step 2: Create placeholder sound files**

Use simple sine-wave data URLs or download royalty-free sounds:
- `drop.mp3` (whoosh)
- `correct.mp3` (ding)
- `wrong.mp3` (buzz)
- `level-complete.mp3` (fanfare)
- `bg-music.mp3` (looping)

- [ ] **Step 3: Add mute button to UI**

In game screen HUD, add sound toggle button. Connected to `AudioManager.toggleMute()`.

- [ ] **Step 4: Call AudioManager from games**

- Drag drop → `AudioManager.play('drop')`
- Correct answer → `AudioManager.play('correct')`
- Wrong answer → `AudioManager.play('wrong')`
- Level complete → `AudioManager.play('level-complete')`

- [ ] **Step 5: Test audio playback**

- Play through games
- Verify sounds play on correct/wrong/drop
- Test mute toggle
- Verify no overlap on rapid clicks

Expected: Audio plays smoothly, throttled, mute toggle works

- [ ] **Step 6: Commit**

```bash
git add js/audio-manager.js assets/sounds/
git commit -m "feat: audio manager with sound effects and mute toggle"
```

---

### Task 10: Asset Placeholders & Visual Polish

**Files:**
- Create: `assets/images/sprites.png` (placeholder)
- Create: `assets/images/mascot.png` (placeholder)
- Create: `assets/images/backgrounds/` (placeholder BGs)
- Modify: `css/games.css` (sprite positioning, animations)

**Interfaces:**
- No new code, asset organization only

- [ ] **Step 1: Generate or source placeholder assets**

- Mascot: cute round character (PNG, ~200x200)
- Objects: apel, bunga, batu, keranjang, vas (PNG sprites)
- Buttons: colored rectangles with text
- Backgrounds: soft gradients or solid colors per spec

Can use AI image gen (e.g., Midjourney prompt: "3D cute chubby round character, no sharp edges, pastel colors"), or simple shapes for now.

- [ ] **Step 2: Create sprite sheet `assets/images/sprites.png`**

Combine all game objects into one image for efficient loading.

- [ ] **Step 3: Update CSS to use sprites**

```css
.apple {
  background-image: url('assets/images/sprites.png');
  background-position: 0 0;
  width: 40px;
  height: 40px;
}
```

- [ ] **Step 4: Add animations (CSS)**

```css
@keyframes correct {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.correct-animation {
  animation: correct 0.5s ease-out;
}
```

- [ ] **Step 5: Test visuals in browser**

- Verify sprites display correctly
- Test drag feedback (opacity, cursor)
- Test animations on correct/wrong

Expected: Game looks polished, animations smooth

- [ ] **Step 6: Commit**

```bash
git add assets/
git commit -m "feat: asset placeholders and visual polish (sprites, animations)"
```

---

### Task 11: Mobile Responsiveness & Accessibility

**Files:**
- Modify: `css/global.css` (touch targets, responsive)
- Modify: `css/ui.css` (responsive layouts)
- Modify: `js/drag-engine.js` (touch events)
- Modify: `index.html` (accessibility attributes)

**Interfaces:**
- Enhancements to existing interfaces for mobile/a11y

- [ ] **Step 1: Update `index.html` with accessibility attributes**

```html
<button id="btn-start" aria-label="Mulai permainan" role="button">Mulai</button>
```

Add semantic HTML (labels, ARIA), lang="id" attribute.

- [ ] **Step 2: Ensure touch targets ≥ 44px**

Update `css/global.css` button sizing:
```css
button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 20px;
}
```

- [ ] **Step 3: Add touch event support to drag engine**

```javascript
// js/drag-engine.js
document.addEventListener('touchstart', (e) => this.handleTouchStart(e));
document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
document.addEventListener('touchend', (e) => this.handleTouchEnd(e));
```

Simulate drag behavior using Pointer Events or custom touch logic.

- [ ] **Step 4: Test on mobile (iOS/Android simulator or device)**

- Drag objects on mobile
- Verify touch targets clickable (44px+)
- Check layout on small screens (320px)
- Test orientation change (portrait → landscape)

Expected: Game playable on mobile, no horizontal scroll, touch smooth

- [ ] **Step 5: Test with screen reader (optional but recommended)**

Use NVDA (Windows) or VoiceOver (Mac/iOS) to verify buttons/screens announce correctly.

- [ ] **Step 6: Commit**

```bash
git add css/ js/drag-engine.js index.html
git commit -m "feat: mobile responsiveness and accessibility (touch, a11y)"
```

---

### Task 12: End-to-End Testing & Launch

**Files:**
- Test: All screens, all games, progression, scoring
- Create: `.gitignore`, `DEPLOYMENT.md`

**Interfaces:**
- No new code, validation only

- [ ] **Step 1: Manual end-to-end test**

- Open app → Title screen
- Click Mulai → Level select (only level 1 unlocked)
- Click level 1 → Game 1 plays
- Complete 5 soals with correct/wrong mix
- Verify score calculated correctly
- Go to level select → check if level 2 unlocked based on score
- Repeat for levels 2-5
- Test each game type's mechanics
- Test mute toggle, page reload (state restored)

Expected: All flows work end-to-end

- [ ] **Step 2: Review Focus testing (5 key failure modes)**

Test the specific cases from Review Focus section above:
- Touch drag accuracy on mobile (drag apel to basket, verify snap)
- Level unlock at exact thresholds (50, 80, 100, 120)
- Drag over inactive zones (no corruption)
- Audio throttling (rapid clicks, no overlap)
- State reload (mid-game refresh, state restored)

Expected: All pass, no edge case bugs

- [ ] **Step 3: Create `.gitignore`**

```
node_modules/
*.swp
.DS_Store
dist/
build/
```

- [ ] **Step 4: Create `DEPLOYMENT.md`**

- How to serve locally (e.g., `python -m http.server`)
- How to deploy to GitHub Pages / static host
- Build process (if any)
- Asset optimization notes

- [ ] **Step 5: Create `package.json` (optional, for build tooling)**

If using any build step, define scripts. For now, can be empty (static assets).

- [ ] **Step 6: Final commit**

```bash
git add .gitignore DEPLOYMENT.md
git commit -m "chore: add deployment docs and finalize for launch"
```

- [ ] **Step 7: Deploy to static host (optional)**

- Upload to GitHub Pages, Vercel, Netlify, or static server
- Test in production URL
- Share link with stakeholders

Expected: Game live and playable

---

## Post-Implementation Checklist

- [ ] All 5 mini-games fully playable
- [ ] Level progression 1-5 works correctly
- [ ] Scoring system accurate (base + streaks + speed bonus)
- [ ] Drag-and-drop smooth on desktop and mobile
- [ ] Audio plays without overlap, mute works
- [ ] State persists across page reloads
- [ ] Responsiveness tested on 320px - 1920px widths
- [ ] Accessibility: buttons ≥ 44px, high contrast, semantic HTML
- [ ] No console errors
- [ ] Performance: page load < 2s, animations 60 FPS

---

**End of Implementation Plan**
