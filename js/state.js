const GameState = (() => {
  const STORAGE_KEY = 'mathgame_state';
  let levelsCache = null;

  const defaultState = {
    childName: 'Anak',
    totalScore: 0,
    highestLevel: 1,
    levelScores: { 1: 0 },
    currentLevel: 1,
    currentGameState: null,
    lastPlayed: Date.now()
  };

  async function loadLevels() {
    if (levelsCache) return levelsCache;
    
    const response = await fetch('data/levels.json');
    const data = await response.json();
    levelsCache = data.levels;
    return levelsCache;
  }

  return {
    load() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return Object.assign(Object.create(this), JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse stored state:', e);
          return Object.assign(Object.create(this), defaultState);
        }
      }
      return Object.assign(Object.create(this), defaultState);
    },

    save() {
      const stateData = {
        childName: this.childName,
        totalScore: this.totalScore,
        highestLevel: this.highestLevel,
        levelScores: this.levelScores,
        currentLevel: this.currentLevel,
        currentGameState: this.currentGameState,
        lastPlayed: this.lastPlayed
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateData));
    },

    async getLevelConfig(levelId) {
      const levels = await loadLevels();
      return levels.find(level => level.id === levelId);
    },

    async updateScore(points) {
      this.totalScore += points;
      this.lastPlayed = Date.now();
      
      const levels = await loadLevels();
      for (const level of levels) {
        if (this.totalScore >= level.unlockThreshold && level.id > this.highestLevel) {
          this.highestLevel = level.id;
        }
      }
      
      this.save();
    },

    async getUnlockedLevels() {
      const levels = await loadLevels();
      return levels
        .filter(level => this.totalScore >= level.unlockThreshold)
        .map(level => level.id);
    }
  };
})();
