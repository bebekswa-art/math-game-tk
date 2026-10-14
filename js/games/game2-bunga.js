class Game2Bunga extends BaseGame {
  constructor(levelId) {
    super(levelId);
    this.gameType = 'bunga';
    this.flowersRemoved = 0;
  }

  async generateSoals() {
    const count = this.config.soalCount || 5;
    this.soals = [];
    for (let i = 0; i < count; i++) {
      const total = Math.floor(Math.random() * 4) + 5;
      const remove = Math.floor(Math.random() * 3) + 1;
       this.soals.push({ 
         total, 
         remove, 
         answer: total - remove,
         answered: false 
       });
    }
  }

  renderSoal(soal) {
    const flowersHtml = this.renderFlowers(soal.total);
    
    const html = `
      <div class="soal-container">
        <h2 class="soal-question">Ada ${soal.total} bunga, ambil ${soal.remove}</h2>
        <div class="game-area">
          <div class="vase-container drop-zone" id="vase-drop">
            <div class="vase-visual">🏺</div>
            <div class="flowers-group" id="flowers-group">
              ${flowersHtml}
            </div>
            <div class="flowers-count">${soal.total - this.flowersRemoved}/${soal.total}</div>
          </div>
        </div>
        <div class="progress">Soal ${this.soalIndex + 1} dari ${this.soals.length}</div>
      </div>
    `;
    this.container.innerHTML = html;

    this.flowersRemoved = 0;
    this.setupDragDrop(soal);
  }

  renderFlowers(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `<div class="flower draggable" data-flower-id="${i}" draggable="true">🌸</div>`;
    }
    return html;
  }

  setupDragDrop(soal) {
    const flowers = this.container.querySelectorAll('.flower');
    const vase = this.container.querySelector('#vase-drop');

    flowers.forEach((flower) => {
      DragEngine.setDragData(flower, { 
        id: flower.getAttribute('data-flower-id'),
        type: 'flower'
      });
    });

    DragEngine.setDropZone(vase, (dragData) => {
      if (dragData.data?.type === 'flower') {
        this.handleFlowerDrop(dragData.source, vase, soal);
      }
    });
  }

  async handleFlowerDrop(source, vase, soal) {
    const flowersGroup = vase.querySelector('#flowers-group');
    const countDisplay = vase.querySelector('.flowers-count');
    
    source.remove();
    this.flowersRemoved++;
    countDisplay.textContent = `${soal.total - this.flowersRemoved}/${soal.total}`;

    AudioManager.play('drop');

    if (this.flowersRemoved === soal.answer) {
      AudioManager.play('correct');
      vase.classList.add('complete');
      const responseTime = Date.now() - this.startTime;
      const points = Scoring.calculatePoints(true, this.streak, responseTime);
      this.currentScore += points;
      this.streak++;
      this.soals[this.soalIndex].answered = true;
      
      setTimeout(() => this.nextSoal(), 800);
    }
  }
}
