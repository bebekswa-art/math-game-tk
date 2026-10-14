window.GameApp = {
  state: {
    currentScreen: null,
    currentLevel: null,
    totalScore: 0,
    levels: []
  },

  async init() {
    try {
      const response = await fetch('data/levels.json');
      this.state.levels = (await response.json()).levels;
      this.showScreen('home');
    } catch (error) {
      console.error('Failed to initialize GameApp:', error);
    }
  },

  showScreen(name) {
    this.state.currentScreen = name;
    const container = document.getElementById('app-container');
    
    if (!container) {
      console.error('App container not found');
      return;
    }

    switch (name) {
      case 'home':
        this._renderHomeScreen();
        break;
      case 'levels':
        this._renderLevelsScreen();
        break;
      case 'game':
        this._renderGameScreen();
        break;
      case 'results':
        this._renderResultsScreen();
        break;
      default:
        console.warn(`Unknown screen: ${name}`);
    }
  },

  startGame(level) {
    this.state.currentLevel = level;
    this.showScreen('game');
  },

  _renderHomeScreen() {
    const container = document.getElementById('app-container');
    container.innerHTML = `
      <div class="screen screen-home">
        <h1>Permainan Matematika TK</h1>
        <p>Belajar berhitung dengan menyenangkan!</p>
        <button class="btn btn-primary btn-large" onclick="window.GameApp.showScreen('levels')">
          Mulai Permainan
        </button>
      </div>
    `;
  },

  _renderLevelsScreen() {
    const container = document.getElementById('app-container');
    const levelsHtml = this.state.levels.map(level => `
      <div class="level-card">
        <h3>${level.name}</h3>
        <p>Kesulitan: ${level.difficulty}</p>
        <button class="btn btn-secondary" onclick="window.GameApp.startGame(${level.id})">
          Mainkan
        </button>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="screen screen-levels">
        <h1>Pilih Level</h1>
        <div class="levels-grid">
          ${levelsHtml}
        </div>
        <button class="btn btn-primary" onclick="window.GameApp.showScreen('home')">
          Kembali
        </button>
      </div>
    `;
  },

  _renderGameScreen() {
    const container = document.getElementById('app-container');
    const level = this.state.levels.find(l => l.id === this.state.currentLevel);

    container.innerHTML = `
      <div class="screen screen-game">
        <h2>${level.name}</h2>
        <p>Level: ${level.id}</p>
        <div id="game-content">
          <!-- Game content will be rendered here by specific game modules -->
        </div>
        <button class="btn btn-secondary" onclick="window.GameApp.showScreen('levels')">
          Kembali
        </button>
      </div>
    `;
  },

  _renderResultsScreen() {
    const container = document.getElementById('app-container');
    container.innerHTML = `
      <div class="screen screen-results">
        <h1>Selesai!</h1>
        <p>Total Skor: ${this.state.totalScore}</p>
        <button class="btn btn-primary btn-large" onclick="window.GameApp.showScreen('home')">
          Kembali ke Beranda
        </button>
      </div>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.GameApp.init();
});
