window.GameApp = {
  state: null,
  currentGame: null,

  async init() {
    try {
      this.state = GameState.load();
      const response = await fetch('data/levels.json');
      const levelsData = await response.json();
      
      this.state.levels = levelsData.levels;
      this.state.levelScores = this.state.levelScores || {};
      
      DragEngine.init();
      this.showScreen('title');
    } catch (error) {
      console.error('Failed to initialize GameApp:', error);
    }
  },

  showScreen(name) {
    if (!this.state) {
      console.error('GameApp state not initialized');
      return;
    }

    this.state.currentScreen = name;
    UIManager.render(name, this.state);

    if (name === 'game') {
      this.initializeGame();
    }
  },

  getGameClass(gameType) {
    const games = {
      'hitung': Game1Hitung,
      'bunga': Game2Bunga,
      'matching': Game3Matching,
      'puzzle': Game4Puzzle,
      'challenge': Game5Challenge
    };
    return games[gameType];
  },

  async initializeGame() {
    if (!this.state || !this.state.currentLevel) return;

    const level = this.state.levels.find(l => l.id === this.state.currentLevel);
    if (!level) return;

    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;

    const GameClass = this.getGameClass(level.game);
    if (!GameClass) {
      console.error(`No game class for type: ${level.game}`);
      return;
    }

    this.currentGame = new GameClass(level.id);
    await this.currentGame.init(gameArea, level);
    DragEngine.init();
    AudioManager.init();
    await this.currentGame.start();
  },

  startGame(levelId) {
    if (!this.state) return;
    
    this.state.currentLevel = levelId;
    this.state.currentGameState = {
      soalIndex: 0,
      score: 0,
      streak: 0,
      accuracy: 0,
      answers: [],
      lastResult: null
    };
    this.showScreen('game');
  },

  nextQuestion() {
    if (!this.state || !this.state.currentGameState) return;
    
    const level = this.state.levels.find(l => l.id === this.state.currentLevel);
    if (!level) return;

    this.state.currentGameState.soalIndex++;
    
    if (this.state.currentGameState.soalIndex >= level.soalCount) {
      this.completeLevel();
    } else {
      this.showScreen('game');
    }
  },

  nextLevel() {
    if (!this.state) return;
    
    const currentLevelId = this.state.currentLevel;
    const nextLevelId = currentLevelId + 1;
    
    if (nextLevelId <= 5) {
      this.startGame(nextLevelId);
    } else {
      this.showScreen('title');
    }
  },

  completeLevel() {
    if (!this.state) return;
    
    const levelId = this.state.currentLevel;
    const levelScore = this.state.currentGameState?.score || 0;
    
    if (!this.state.levelScores) {
      this.state.levelScores = {};
    }
    this.state.levelScores[levelId] = levelScore;
    
    this.state.updateScore?.(levelScore);
  },

  showResults(correct, points, stars) {
    if (!this.state || !this.state.currentGameState) return;
    
    this.state.currentGameState.lastResult = {
      isCorrect: correct,
      points: points,
      stars: stars
    };
    
    this.showScreen('results');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.GameApp.init();
});
