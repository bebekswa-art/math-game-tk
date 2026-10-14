class BaseGame {
  constructor(levelId) {
    this.levelId = levelId;
    this.soalIndex = 0;
    this.soals = [];
    this.streak = 0;
    this.currentScore = 0;
    this.startTime = null;
    this.container = null;
    this.config = null;
  }

  async init(container, config) {
    this.container = container;
    this.config = config;
    this.startTime = Date.now();
    await this.generateSoals();
  }

  async start() {
    this.renderCurrentSoal();
  }

  async generateSoals() {
    throw new Error('generateSoals must be implemented in subclass');
  }

  renderCurrentSoal() {
    if (this.soalIndex >= this.soals.length) {
      this.complete();
      return;
    }
    const soal = this.soals[this.soalIndex];
    this.renderSoal(soal);
  }

  renderSoal(soal) {
    throw new Error('renderSoal must be implemented in subclass');
  }

  async onDropObject(source, target, data) {
  }

  async nextSoal() {
    this.soalIndex++;
    this.renderCurrentSoal();
  }

  async complete() {
    const stars = this.calculateStars();
    GameApp.showResults(true, this.currentScore, stars);
  }

  calculateStars() {
    const accuracy = (this.soalIndex > 0) ? (this.streak / this.soalIndex) * 100 : 0;
    if (accuracy >= 80) return 3;
    if (accuracy >= 50) return 2;
    return 1;
  }
}
