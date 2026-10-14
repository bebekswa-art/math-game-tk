class Game2Bunga extends BaseGame {
  constructor(levelId) {
    super(levelId);
    this.gameType = 'bunga';
  }

  async generateSoals() {
    const count = this.config.soalCount || 5;
    this.soals = [];
    for (let i = 0; i < count; i++) {
      this.soals.push({ answered: false });
    }
  }

  renderSoal(soal) {
    this.container.innerHTML = '<p>Game 2 coming soon</p>';
  }
}
