window.GameApp = {
  state: null,
  currentGame: null,

  async init() {
    try {
      this.state = GameState.load();
      console.log('Game state loaded:', this.state ? 'yes' : 'no');
      
      const response = await fetch('data/levels.json');
      if (!response.ok) throw new Error(`Failed to fetch levels: ${response.status}`);
      const levelsData = await response.json();
      
      this.state.levels = levelsData.levels;
      this.state.levelScores = this.state.levelScores || {};
      
      console.log('Levels loaded:', this.state.levels?.length || 0);
      console.log('Level configs:', this.state.levels?.map(l => `${l.id}:${l.name}`));
      
      DragEngine.init();
      AudioManager.init();
      this.showScreen('title');
      console.log('Game initialized, showing title screen');
    } catch (error) {
      console.error('Failed to initialize GameApp:', error);
      // Show error screen
      const container = document.getElementById('app-container');
      if (container) {
        container.innerHTML = `
          <div style="padding: 20px; text-align: center; color: var(--color-caution);">
            <h3>Error Memuat Game</h3>
            <p>${error.message}</p>
            <button onclick="window.location.reload()">Mulai Ulang</button>
          </div>
        `;
      }
    }
  },

  showScreen(name) {
    if (!this.state) {
      console.error('GameApp state not initialized');
      return;
    }

    console.log('Showing screen:', name);
    this.state.currentScreen = name;
    
    // Clear container first
    const container = document.getElementById('app-container');
    if (!container) {
      console.error('App container not found');
      return;
    }
    container.innerHTML = '';
    
    UIManager.render(name, this.state);
    console.log('Screen rendered, currentScreen:', this.state.currentScreen);
  },