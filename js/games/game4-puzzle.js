class Game4Puzzle extends BaseGame {
  constructor(levelId) {
    super(levelId);
    this.gameType = 'puzzle';
    this.stonesInCircle = 0;
    this.answerButtonsShown = false;
  }

  async generateSoals() {
    const count = this.config.soalCount || 5;
    this.soals = [];
    for (let i = 0; i < count; i++) {
      const a = Math.floor(Math.random() * 6) + 1;
      const b = Math.floor(Math.random() * 4) + 1;
      const answer = a + b;
      this.soals.push({ 
        a, 
        b, 
        answer,
        answered: false 
      });
    }
  }

  renderSoal(soal) {
    const stonesA = this.renderStones(soal.a, 'group-a');
    const stonesB = this.renderStones(soal.b, 'group-b');
    const answersHtml = this.generateAnswerOptions(soal.answer);
    
    const html = `
      <div class="soal-container">
        <h2 class="soal-question">${soal.a} batu + ${soal.b} batu = ?</h2>
        <div class="puzzle-area">
          <div class="objects-area">
            <div class="stones-group">
              ${stonesA}
            </div>
            <div class="plus-sign">+</div>
            <div class="stones-group">
              ${stonesB}
            </div>
          </div>
          <div class="target-circle drop-zone" id="target-circle">
            <div class="circle-visual"></div>
            <div class="stones-count">${this.stonesInCircle}/${soal.a + soal.b}</div>
          </div>
        </div>
        <div class="answer-buttons-container" id="answer-buttons" style="display: none;">
          ${answersHtml}
        </div>
        <div class="progress">Soal ${this.soalIndex + 1} dari ${this.soals.length}</div>
      </div>
    `;
    this.container.innerHTML = html;

    this.stonesInCircle = 0;
    this.answerButtonsShown = false;
    this.setupDragDrop(soal);
  }

  renderStones(count, group) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `<div class="stone draggable" data-group="${group}" data-index="${i}" draggable="true">🪨</div>`;
    }
    return html;
  }

  generateAnswerOptions(correctAnswer) {
    const options = [correctAnswer];
    
    while (options.length < 3) {
      const wrongAnswer = Math.floor(Math.random() * 12) + 1;
      if (!options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    options.sort(() => Math.random() - 0.5);
    
    let html = '<div class="answer-buttons-grid">';
    for (const option of options) {
      const isCorrect = option === correctAnswer ? 'data-correct="true"' : '';
      html += `<button class="answer-button" ${isCorrect}>${option}</button>`;
    }
    html += '</div>';
    return html;
  }

  setupDragDrop(soal) {
    const stones = this.container.querySelectorAll('.stone');
    const targetCircle = this.container.querySelector('#target-circle');

    stones.forEach((stone, idx) => {
      DragEngine.setDragData(stone, { 
        id: `stone-${idx}`,
        type: 'stone'
      });
    });

    DragEngine.setDropZone(targetCircle, (dragData) => {
      if (dragData.data?.type === 'stone') {
        this.handleStoneDrop(dragData.source, targetCircle, soal);
      }
    });
  }

  async handleStoneDrop(source, targetCircle, soal) {
    const countDisplay = targetCircle.querySelector('.stones-count');
    
    source.style.display = 'none';
    this.stonesInCircle++;
    countDisplay.textContent = `${this.stonesInCircle}/${soal.a + soal.b}`;

    AudioManager.play('drop');

    if (this.stonesInCircle === soal.a + soal.b && !this.answerButtonsShown) {
      this.answerButtonsShown = true;
      const answerButtons = this.container.querySelector('#answer-buttons');
      answerButtons.style.display = 'block';
      
      const buttons = answerButtons.querySelectorAll('.answer-button');
      buttons.forEach(button => {
        button.addEventListener('click', () => this.handleAnswerClick(button, soal));
      });
    }
  }

  async handleAnswerClick(button, soal) {
    const isCorrect = button.getAttribute('data-correct') === 'true';
    const answerContainer = button.parentElement;

    if (isCorrect) {
      AudioManager.play('correct');
      button.classList.add('correct');
      const responseTime = Date.now() - this.startTime;
      const points = Scoring.calculatePoints(true, this.streak, responseTime);
      this.currentScore += points;
      this.streak++;
      this.soals[this.soalIndex].answered = true;

      setTimeout(() => this.nextSoal(), 800);
    } else {
      AudioManager.play('wrong');
      answerContainer.classList.add('shake');
      setTimeout(() => answerContainer.classList.remove('shake'), 300);
      button.classList.add('wrong');
      setTimeout(() => button.classList.remove('wrong'), 300);
    }
  }
}
