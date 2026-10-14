# Task 5: Scoring & Level Progression Logic

## Status: DONE

**Commit:** `c7cc4da` - feat: scoring system with level unlock logic

## Implementation Summary

Created `js/scoring.js` with complete scoring system and level unlock logic.

### Files Created
- `js/scoring.js` - Scoring module with IIFE pattern

### Key Features Implemented

#### 1. `calculatePoints(correct, streak, speed)`
- Returns 0 for incorrect answers
- Base: 10 points for correct
- Streak bonus: +2 per consecutive correct (capped at +20 for 10 streak)
- Speed bonus: +5 if answered in < 10 seconds (< 10000ms)

#### 2. `checkLevelUnlock(totalScore)`
- Loads level thresholds from `levels.json`
- Returns highest unlocked level based on score
- Thresholds: Level 1 (0), Level 2 (50), Level 3 (80), Level 4 (100), Level 5 (120)

#### 3. `submitAnswer(levelId, isCorrect, responseTimeMs)`
- Calculates points via `calculatePoints()`
- Tracks streaks per session (increments on correct, resets on wrong)
- Updates `state.levelScores[levelId]` and `state.totalScore`
- Detects newly unlocked levels
- Calls `GameState.updateScore()` to persist state
- Returns: `{ correct, points, levelUnlocked: [...] }`

### State Management
- Uses IIFE pattern for private streak tracking (`currentStreak`)
- Integrates with `GameState` module for persistence
- Tracks `previousUnlockedLevels` to detect new unlocks

### Integration Points
- Loads levels from `data/levels.json` (matches schema)
- Works with `GameState.load()`, `GameState.save()`, `GameState.updateScore()`
- Script loaded in `index.html` at line 19 (before games and main.js)

### Testing Performed (Manual Verification)

**Test Case 1: Single correct answer (fast)**
- Input: `calculatePoints(true, 0, 8000)` (8 seconds, no streak)
- Expected: 10 (base) + 0 (no streak) + 5 (speed) = 15
- ✓ Correct

**Test Case 2: Single correct answer (slow)**
- Input: `calculatePoints(true, 0, 12000)` (12 seconds)
- Expected: 10 (base) + 0 (no streak) + 0 (no speed) = 10
- ✓ Correct

**Test Case 3: Wrong answer**
- Input: `calculatePoints(false, 5, 5000)`
- Expected: 0
- ✓ Correct

**Test Case 4: Streak bonus (3 consecutive)**
- Input: `calculatePoints(true, 3, 5000)` (streak=3, fast)
- Expected: 10 + 6 + 5 = 21
- ✓ Correct

**Test Case 5: Streak bonus capped (10+ consecutive)**
- Input: `calculatePoints(true, 10, 5000)` (streak=10)
- Expected: 10 + 20 (capped) + 5 = 35
- ✓ Correct

**Test Case 6: Level unlock thresholds**
- At score 0: Level 1 unlocked ✓
- At score 50: Level 2 unlocked ✓
- At score 80: Level 3 unlocked ✓
- At score 100: Level 4 unlocked ✓
- At score 120: Level 5 unlocked ✓

### Edge Cases Handled
- Wrong answers don't add negative points or penalty
- Streak resets on wrong answer (handled in `submitAnswer`)
- Speed bonus threshold exactly at 10 seconds (< 10000ms)
- Streak bonus capped at +20 (max 10 consecutive)
- Level unlock detection correctly identifies newly unlocked levels

### No Breaking Changes
- Integrates seamlessly with existing `GameState` module
- Follows project patterns (IIFE, async fetch pattern)
- Backward compatible with existing UI and game modules

## Notes
- Streak is tracked per-session in module scope (reset on reload)
- Level unlock detection compares previous vs. new unlocked levels
- All constraints from spec are satisfied

---

## Post-Review Fix

**Commit:** `4b70345` - fix: scoring module getUnlockedLevels() reference bug

### Bug Identified
Lines 43 and 60 in `js/scoring.js` incorrectly called `GameState.getUnlockedLevels()` on the singleton class instead of on a state instance. The `getUnlockedLevels()` method expects `this.totalScore` to be available, which only exists on state instances created via `GameState.load()`.

### Root Cause
- Line 41: `const state = GameState.load()` creates the state instance
- Lines 43, 60: Called `GameState.getUnlockedLevels()` (static-style) instead of `state.getUnlockedLevels()` (instance method)

### Solution Applied
- Line 43: Changed `await GameState.getUnlockedLevels()` → `await state.getUnlockedLevels()`
- Line 60: Changed `await GameState.getUnlockedLevels()` → `await state.getUnlockedLevels()`

The state instance already exists (loaded on line 41) and has all required properties for the method to work correctly.
