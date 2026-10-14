class Game1Hitung extends BaseGame {
  constructor(levelId) {
    super(levelId);
    this.gameType = 'hitung';
    this.applesInBasket = 0;
  }

  async generateSoals() {
    const maxSum = this.config.params.maxSum;
    const count = this.config.soalCount || 5;
    this.soals = [];
    for (let i = 0; i < count; i++) {
      const a = Math.floor(Math.random() * maxSum) + 1;
      const b = Math.floor(Math.random() * (maxSum - a)) + 1;
      this.soals.push({ a, b, answer: a + b, answered: false });
    }
  }

  renderSoal(soal) {
    const applesA = this.renderApples(soal.a, 'group-a');
    const applesB = this.renderApples(soal.b, 'group-b');
    
    const html = `
      <div class="soal-container">
        <h2 class="soal-question">Kumpulkan ${soal.a} apel + ${soal.b} apel</h2>
        <div class="game-area">
          <div class="objects-area">
            <div class="apple-group">
              ${applesA}
            </div>
            <div class="apple-group">
              ${applesB}
            </div>
          </div>
          <div class="basket drop-zone" id="basket-drop">
            <div class="basket-visual">🧺</div>
            <div class="basket-count">0/${soal.answer}</div>
          </div>
        </div>
        <div class="progress">Soal ${this.soalIndex + 1} dari ${this.soals.length}</div>
      </div>
    `;
    this.container.innerHTML = html;

    this.applesInBasket = 0;
    this.setupDragDrop(soal);
  }

  renderApples(count, group) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `<div class="apple draggable" data-group="${group}" data-index="${i}" draggable="true">🍎</div>`;
    }
    return html;
  }

  setupDragDrop(soal) {
    const apples = this.container.querySelectorAll('.apple');
    const basket = this.container.getElementById('basket-drop');

    apples.forEach((apple, idx) => {
      DragEngine.setDragData(apple, { 
        id: `apple-${soal.a}-${idx}`,
        type: 'apple'
      });
    });

    DragEngine.setDropZone(basket, (dragData) => {
      if (dragData.data?.type === 'apple') {
        this.handleAppleDrop(dragData.source, basket, soal);
      }
    });
  }

  async handleAppleDrop(source, basket, soal) {
    this.applesInBasket++;
    const countDisplay = basket.querySelector('.basket-count');
    countDisplay.textContent = `${this.applesInBasket}/${soal.answer}`;

    AudioManager.play('drop');

    if (this.applesInBasket === soal.answer) {
      AudioManager.play('correct');
      basket.classList.add('complete');
      const responseTime = Date.now() - this.startTime;
      const points = Scoring.calculatePoints(true, this.streak, responseTime);
      this.currentScore += points;
      this.streak++;
      this.soals[this.soalIndex].answered = true;
      
      setTimeout(() => this.nextSoal(), 800);
    } else if (this.applesInBasket > soal.answer) {
      AudioManager.play('wrong');
      basket.classList.add('shake');
      setTimeout(() => basket.classList.remove('shake'), 300);
      this.applesInBasket--;
      countDisplay.textContent = `${this.applesInBasket}/${soal.answer}`;
    }
  }
}
