const Scoring = (() => {
  let currentStreak = 0;
  let previousUnlockedLevels = [];

  async function getLevelsData() {
    const response = await fetch('data/levels.json');
    const data = await response.json();
    return data.levels;
  }

  return {
    calculatePoints(correct, streak, speed) {
      if (!correct) {
        return 0;
      }

      let points = 10;
      points += Math.min(streak * 2, 20);
      
      if (speed < 10000) {
        points += 5;
      }

      return points;
    },

    async checkLevelUnlock(totalScore) {
      const levels = await getLevelsData();
      let highestLevel = 1;

      for (const level of levels) {
        if (totalScore >= level.unlockThreshold) {
          highestLevel = level.id;
        }
      }

      return highestLevel;
    },

    async submitAnswer(levelId, isCorrect, responseTimeMs) {
      const state = GameState.load();
      
      previousUnlockedLevels = await state.getUnlockedLevels();
      
      const points = this.calculatePoints(isCorrect, currentStreak, responseTimeMs);

      if (isCorrect) {
        currentStreak += 1;
      } else {
        currentStreak = 0;
      }

      if (!state.levelScores[levelId]) {
        state.levelScores[levelId] = 0;
      }
      state.levelScores[levelId] += points;

      await state.updateScore(points);

      const newUnlockedLevels = await state.getUnlockedLevels();
      const newlyUnlocked = newUnlockedLevels.filter(
        id => !previousUnlockedLevels.includes(id)
      );

      return {
        correct: isCorrect,
        points: points,
        levelUnlocked: newlyUnlocked
      };
    }
  };
})();
