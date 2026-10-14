class Game5Challenge extends BaseGame {
  constructor(levelId) {
    super(levelId);
    this.gameType = 'challenge';
  }

  async generateSoals() {
    const count = this.config.soalCount || 5;
    this.soals = [];
    for (let i = 0; i < count; i++) {
      this.soals.push({ answered: false });
    }
  }

  renderSoal(soal) {
    this.container.innerHTML = '<p>Game 5 coming soon</p>';
  }
}
