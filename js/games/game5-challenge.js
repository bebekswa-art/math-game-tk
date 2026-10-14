class Game5Challenge extends BaseGame {
  constructor(levelId) {
    super(levelId);
    this.gameType = 'challenge';
    this.consecutiveCorrect = 0;
    this.winStreak = 5;
  }

  async generateSoals() {
    const maxOperand = this.config.params?.maxOperand || 10;
    const soalCount = 20;
    this.soals = [];
    
    for (let i = 0; i < soalCount; i++) {
      const isAddition = Math.random() > 0.5;
      let a, b, answer, operation;

      if (isAddition) {
        a = Math.floor(Math.random() * maxOperand) + 1;
        b = Math.floor(Math.random() * maxOperand) + 1;
        answer = a + b;
        operation = '+';
      } else {
        a = Math.floor(Math.random() * maxOperand) + 1;
        b = Math.floor(Math.random() * (a - 1)) + 1;
        answer = a - b;
        operation = '-';
      }

      this.soals.push({
        a,
        b,
        operation,
        answer,
        answered: false
      });
    }
  }

  renderSoal(soal) {
    const wrongAnswers = this.generateWrongAnswers(soal.answer);
    const allAnswers = [soal.answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    const objectsHtml = this.renderObjects(soal);
    const buttonsHtml = this.renderAnswerButtons(allAnswers, soal);
    
    const html = `
      <div class="soal-container challenge-container">
        <div class="challenge-header">
          <div class="streak-counter">
            <span class="streak-label">Benar Berturut-turut:</span>
            <span class="streak-value">${this.consecutiveCorrect}/${this.winStreak}</span>
          </div>
        </div>
        
        <div class="challenge-equation">
          <span class="equation-text">${soal.a} ${soal.operation} ${soal.b} = ?</span>
        </div>
        
        <div class="challenge-game-area">
          ${objectsHtml}
          <div class="target-circle">
            <div class="circle-label">Target</div>
          </div>
        </div>
        
        <div class="answer-buttons">
          ${buttonsHtml}
        </div>
        
        <div class="progress">Soal ${this.soalIndex + 1} dari ${this.soals.length}</div>
      </div>
    `;
    
    this.container.innerHTML = html;
    this.setupAnswerButtons(allAnswers, soal);
  }

  renderObjects(soal) {
    const totalCount = soal.a + soal.b;
    let html = '<div class="objects-area">';
    
    for (let i = 0; i < totalCount; i++) {
      html += `<div class="challenge-stone draggable" data-index="${i}" draggable="true">🪨</div>`;
    }
    
    html += '</div>';
    return html;
  }

  generateWrongAnswers(correctAnswer) {
    const wrongAnswers = [];
    const variations = [
      correctAnswer + 1,
      correctAnswer - 1,
      correctAnswer + 2,
      Math.max(1, correctAnswer - 2)
    ];
    
    return variations
      .filter(v => v !== correctAnswer && v > 0)
      .slice(0, 3);
  }

  renderAnswerButtons(answers, soal) {
    return answers.map((answer, idx) => `
      <button class="answer-button" data-answer="${answer}" data-correct="${answer === soal.answer}">
        ${answer}
      </button>
    `).join('');
  }

  setupAnswerButtons(allAnswers, soal) {
    const buttons = this.container.querySelectorAll('.answer-button');
    
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const selectedAnswer = parseInt(button.dataset.answer);
        const isCorrect = selectedAnswer === soal.answer;
        
        if (isCorrect) {
          this.handleCorrectAnswer(soal);
        } else {
          this.handleWrongAnswer(button);
        }
      });
    });

    const stones = this.container.querySelectorAll('.challenge-stone');
    const target = this.container.querySelector('.target-circle');

    stones.forEach((stone, idx) => {
      DragEngine.setDragData(stone, {
        id: `stone-${this.soalIndex}-${idx}`,
        type: 'stone'
      });
    });

    DragEngine.setDropZone(target, (dragData) => {
      if (dragData.data?.type === 'stone') {
        dragData.source.remove();
      }
    });
  }

  handleCorrectAnswer(soal) {
    this.consecutiveCorrect++;
    const responseTime = Date.now() - this.startTime;
    const points = Scoring.calculatePoints(true, this.consecutiveCorrect, responseTime);
    this.currentScore += points;
    this.streak++;
    soal.answered = true;

    AudioManager.play('correct');

    if (this.consecutiveCorrect >= this.winStreak) {
      this.celebrateWin();
    } else {
      setTimeout(() => this.nextSoal(), 800);
    }
  }

  handleWrongAnswer(button) {
    this.consecutiveCorrect = 0;
    AudioManager.play('wrong');
    
    button.classList.add('shake');
    setTimeout(() => button.classList.remove('shake'), 300);
    
    const allButtons = this.container.querySelectorAll('.answer-button');
    allButtons.forEach(b => b.disabled = true);
    
    setTimeout(() => {
      allButtons.forEach(b => b.disabled = false);
    }, 600);
  }

  celebrateWin() {
    const container = this.container;
    container.classList.add('celebrate');
    AudioManager.play('correct');
    
    const celebration = document.createElement('div');
    celebration.className = 'celebration-animation';
    celebration.innerHTML = `
      <div class="confetti"></div>
      <div class="confetti"></div>
      <div class="confetti"></div>
      <div class="confetti"></div>
      <div class="confetti"></div>
      <h1 class="victory-text">🎉 MENANG! 🎉</h1>
    `;
    container.appendChild(celebration);
    
    setTimeout(() => this.complete(), 2000);
  }
}
