# Math Game for TK: Design Specification
**Date:** 2026-10-14  
**Project:** Educational Math Game (Kindergarten)  
**Version:** 1.0

---

## 1. Project Overview

A web-based educational game for kindergarten children focused on teaching addition and subtraction through interactive drag-and-drop mini-games. The game combines visual learning with gamification elements (scoring, progression, rewards) to maintain engagement.

**Target Audience:** Children age 4-6 (TK/Kindergarten)  
**Platform:** Web (responsive, touch-friendly)  
**Core Mechanic:** Drag-and-drop object manipulation  
**Difficulty Progression:** Level 1 (Easy) → Level 5 (Hard)

---

## 2. Visual & Audio Design

### Art Style
- **Genre:** 3D cute cartoon
- **Character Design:** Chubby, round, adorable with no sharp edges
  - Large expressive eyes
  - Warm pastel colors (soft reds, blues, yellows, greens)
  - High contrast for visual clarity
- **Lighting:** Soft studio-style lighting (studio animation feel)
- **Backgrounds:** Clean solid colors or soft gradients
- **Objects:** Simple shapes (apples, flowers, stones, numbers) matching character aesthetic

### Audio
- Soft, cheerful background music (looping, non-intrusive)
- Sound effects for interactions:
  - Drag start/drop: gentle *whoosh*
  - Correct answer: cheerful *ding* + short jingle
  - Wrong answer: soft *buzz* (no punitive tone)
  - Level complete: celebration sound + visual animation

---

## 3. Game Architecture

### Tech Stack
- **Frontend:** Vanilla JavaScript + HTML5 Canvas (or HTML5 Drag-and-Drop API)
- **Styling:** CSS3 (flexbox, animations)
- **State Management:** Vanilla JS (game state object)
- **Deployment:** Static site (no backend required initially)
- **Responsiveness:** Mobile-first (touch-friendly drag)

### Core Components
1. **Game State Manager** — tracks current level, score, progress
2. **Mini-Game Controller** — loads and manages individual game instances
3. **Drag-and-Drop Engine** — handles drag interactions
4. **Scoring System** — calculates points, unlocks next level
5. **UI Manager** — renders HUD (score, level, progress bar)
6. **Asset Manager** — preloads game images/sounds

---

## 4. Five Mini-Games

### Game 1: "Hitung & Kumpul" (Counting + Addition)
**Difficulty:** Level 1-2 (Easy)

**Mechanic:**
- Display shows: "Kumpulkan 3 apel + 2 apel"
- 5 apel objects appear on screen (visually separated into groups)
- Child drags all apel into a basket/container
- Correct: basket shows total "5 apel" → celebration
- Wrong: feedback "Coba lagi" with hint count

**Learning Goal:** Quantity recognition, basic addition

**Parameters by Level:**
- Level 1: 1-3 + 1-2 (max sum = 5)
- Level 2: 2-4 + 1-3 (max sum = 7)

---

### Game 2: "Bunga ke Vas" (Subtraction)
**Difficulty:** Level 2-3 (Easy-Medium)

**Mechanic:**
- Display shows: "Ada 5 bunga, ambil 2"
- 5 bunga appear in a vas
- Child drags 2 bunga out of the vas
- Remaining bunga count verified → result shown
- Correct: show "Sisa 3 bunga" with animation
- Wrong: "Tidak tepat, coba lagi"

**Learning Goal:** Subtraction, removal concept

**Parameters by Level:**
- Level 2: 3-5 total, remove 1-2
- Level 3: 5-8 total, remove 2-3

---

### Game 3: "Matching Angka" (Number Recognition)
**Difficulty:** Level 3 (Medium)

**Mechanic:**
- Left side: Numbers (1, 2, 3, 4, 5)
- Right side: Object groups (e.g., 🍎🍎, 🍎🍎🍎)
- Child drags number to match correct quantity
- Correct match: highlight + sound
- Wrong: shake animation, try again

**Learning Goal:** Number-quantity association

**Parameters by Level:**
- Level 3: 1-6 objects, single digits

---

### Game 4: "Puzzle Penjumlahan" (Mixed Addition with Blocks)
**Difficulty:** Level 4 (Medium-Hard)

**Mechanic:**
- Display: "2 batu + 3 batu = ?"
- Two groups of stone objects appear
- Child drags stones into a target circle
- System counts total → shows equation
- Child selects answer from 3 options (visual number buttons)
- Correct: celebration + next soal
- Wrong: "Hitung lagi"

**Learning Goal:** Visual addition, answer selection

**Parameters by Level:**
- Level 4: 2-6 + 1-4 (max sum = 10)

---

### Game 5: "Challenge Mode" (Mixed Add & Subtract)
**Difficulty:** Level 5 (Hard)

**Mechanic:**
- Random mix of addition & subtraction soal
- Soal range: 1-10 operands
- Similar drag-and-drop with object groups
- Timed or untimed (configurable)
- Scoring: correct = +10 points, streak bonus
- Win condition: 5 consecutive correct

**Learning Goal:** Fast recognition, mixed operations, confidence building

**Parameters by Level:**
- Level 5: 1-10 + 1-10 / 10-1-10 (hardest subset)

---

## 5. Scoring & Progression System

### Scoring Rules
- **Correct answer:** +10 points base
- **Streak bonus:** +2 per consecutive correct (max +20)
- **Speed bonus:** +5 if answered in < 10 seconds
- **Wrong answer:** 0 points, no penalty

### Level Progression
| Level | Game | Difficulty | Unlock Condition |
|-------|------|-----------|-----------------|
| 1 | Hitung & Kumpul | Easy | Game start |
| 2 | Hitung & Kumpul + Bunga ke Vas | Easy | 50 points Level 1 |
| 3 | Matching Angka + Bunga ke Vas | Medium | 80 points Level 2 |
| 4 | Puzzle Penjumlahan | Medium-Hard | 100 points Level 3 |
| 5 | Challenge Mode | Hard | 120 points Level 4 |

### Persistence
- LocalStorage: save child's name, highest level, total score, last played
- Optional: simple "leaderboard" (on same device only)

---

## 6. User Interface (UX/Flow)

### Screens
1. **Title Screen**
   - Logo + "Permainan Matematika"
   - "Mulai" button (enter name optional)
   - Cute mascot character

2. **Level Select Screen**
   - Show levels 1-5 with lock/unlock status
   - Display child's current score
   - Progress bar

3. **Game Screen (In-Game)**
   - Top: Level indicator + Score counter
   - Middle: Game soal display + objects to drag
   - Bottom: Hint button + Sound toggle
   - Right: Progress bar (soal count)

4. **Result Screen (After soal)**
   - Show correct/wrong with animation
   - Points awarded
   - "Next" button → next soal or level complete screen

5. **Level Complete Screen**
   - "Selamat!" animation
   - Stars earned (1-3 based on score)
   - Total level score
   - "Next Level" or "Ulang Level" button

### Accessibility
- High contrast (WCAG AA minimum)
- Touch targets ≥ 44px (iOS/Android guideline)
- Readable fonts (sans-serif, 18px+ for TK)
- No time pressure initially (timed optional in Level 5)
- Colorblind-friendly palette (no red-green only distinction)

---

## 7. Technical Implementation Details

### Frontend Structure
```
/
├── index.html              # Main entry point
├── css/
│   ├── style.css          # Global styles
│   └── games.css          # Game-specific styles
├── js/
│   ├── main.js            # App initialization
│   ├── game-state.js      # State management
│   ├── drag-engine.js     # Drag-and-drop logic
│   ├── games/
│   │   ├── game1.js       # Hitung & Kumpul
│   │   ├── game2.js       # Bunga ke Vas
│   │   ├── game3.js       # Matching Angka
│   │   ├── game4.js       # Puzzle Penjumlahan
│   │   └── game5.js       # Challenge Mode
│   └── ui.js              # UI rendering
├── assets/
│   ├── images/            # Sprites, backgrounds, objects
│   ├── sounds/            # Background music, SFX
│   └── fonts/             # Custom fonts (if needed)
└── data/
    └── levels.json        # Level configuration
```

### Drag-and-Drop Implementation
- Use HTML5 Drag and Drop API (or Pointer Events for better touch support)
- Draggable objects: data attributes store type/value
- Drop zones: highlight on drag-over, validate on drop
- Feedback: visual states (hover, dragging, valid-drop, invalid-drop)

### State Structure
```javascript
{
  currentLevel: 1,
  totalScore: 0,
  childName: "Budi",
  unlockedLevels: [1, 2],
  levelScores: { 1: 150, 2: 200 },
  currentGameState: {
    gameType: "hitung-kumpul",
    soalIndex: 0,
    soal: { question: "2+3", answer: 5 },
    answersSubmitted: 1,
    correctCount: 1,
    currentScore: 10
  }
}
```

---

## 8. Asset Requirements

### Graphics
- **Mascot character:** 1 cute chubby character (multiple expressions)
- **Objects:** Apel, Bunga, Batu, Keranjang, Vas, Angka (1-10)
- **UI elements:** Buttons, progress bars, stars, score display
- **Backgrounds:** 5 scene backgrounds (one per level, or reusable gradient)
- **Animations:** Drag feedback, correct/wrong reactions, celebration particles

### Audio
- **Background music:** 1 looping track (30-60 sec, royalty-free)
- **Sound effects:** Drop, correct, wrong, level-complete, celebration (5-8 files)

### Format & Delivery
- Images: PNG or WebP (optimized for web)
- Audio: MP3 (web-compatible)
- All assets embedded or CDN-served

---

## 9. Success Criteria

1. **Functionality:**
   - All 5 mini-games fully playable
   - Drag-and-drop responsive (< 100ms latency)
   - Score system tracks correctly
   - Level progression unlocks as specified

2. **Usability (TK-friendly):**
   - Touch targets ≥ 44px
   - No buttons outside screen on mobile
   - Text readable without zoom
   - Clear visual feedback for all actions

3. **Performance:**
   - Page load < 2 seconds on 4G
   - No janky animations (60 FPS target)
   - Sound plays without delay

4. **Engagement:**
   - Visual/audio feedback for all interactions
   - Difficulty feels appropriate (not too hard, not too easy)
   - Child wants to replay

---

## 10. Future Enhancements (Out of Scope for MVP)
- Multiplayer / competitive mode
- More mini-games (multiplication, division)
- Parental dashboard (progress tracking)
- Leaderboard (cloud-based)
- AR/VR integration
- Offline mode (PWA)

---

## Appendix: Color Palette

**Warm Pastels:**
- Primary: #FFB6C1 (light pink)
- Secondary: #87CEEB (sky blue)
- Accent: #FFDAB9 (peach)
- Success: #90EE90 (light green)
- Caution: #FFD700 (gold)
- Background: #FFFAF0 (floral white) or soft gradient

---

**End of Specification**
