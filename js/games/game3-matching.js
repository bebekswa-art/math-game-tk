class Game3Matching extends BaseGame {
  constructor(levelId) {
    super(levelId);
    this.gameType = 'matching';
    this.matchedGroups = new Set();
  }

  async generateSoals() {
    const count = this.config.soalCount || 5;
    this.soals = [];
    
    for (let i = 0; i < count; i++) {
      const availableNumbers = [1, 2, 3, 4, 5, 6];
      const shuffled = availableNumbers.sort(() => Math.random() - 0.5);
      const selectedNumbers = shuffled.slice(0, Math.floor(Math.random() * 3) + 3);
      
      this.soals.push({
        numbers: selectedNumbers.sort((a, b) => a - b),
        answered: false
      });
    }
  }

  renderSoal(soal) {
    const numbersHtml = this.renderNumbers(soal.numbers);
    const groupsHtml = this.renderObjectGroups(soal.numbers);
    
    const html = `
      <div class="soal-container">
        <h2 class="soal-question">Cocokkan angka dengan benda</h2>
        <div class="matching-area">
          <div class="numbers-column">
            <div class="numbers-list">
              ${numbersHtml}
            </div>
          </div>
          <div class="objects-column">
            <div class="objects-groups">
              ${groupsHtml}
            </div>
          </div>
        </div>
        <div class="progress">Soal ${this.soalIndex + 1} dari ${this.soals.length}</div>
      </div>
    `;
    this.container.innerHTML = html;

    this.matchedGroups.clear();
    this.setupDragDrop(soal);
  }

  renderNumbers(numbers) {
    let html = '';
    for (const num of numbers) {
      html += `<div class="number-button draggable" data-number="${num}" draggable="true">${num}</div>`;
    }
    return html;
  }

  renderObjectGroups(numbers) {
    let html = '';
    for (const num of numbers) {
      const objectsHtml = this.renderObjects(num);
      html += `
        <div class="object-group drop-zone" data-target-number="${num}">
          <div class="objects-container">
            ${objectsHtml}
          </div>
          <div class="group-label">🍎</div>
        </div>
      `;
    }
    return html;
  }

  renderObjects(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `<span class="object-item">🍎</span>`;
    }
    return html;
  }

  setupDragDrop(soal) {
    const numberButtons = this.container.querySelectorAll('.number-button');
    const objectGroups = this.container.querySelectorAll('.object-group');

    numberButtons.forEach((button) => {
      DragEngine.setDragData(button, { 
        id: `number-${button.getAttribute('data-number')}`,
        type: 'number',
        number: parseInt(button.getAttribute('data-number'))
      });
    });

    objectGroups.forEach((group) => {
      DragEngine.setDropZone(group, (dragData) => {
        if (dragData.data?.type === 'number') {
          this.handleNumberDrop(dragData.source, group, soal);
        }
      });
    });
  }

  async handleNumberDrop(source, targetGroup, soal) {
    const draggedNumber = parseInt(source.getAttribute('data-number'));
    const targetNumber = parseInt(targetGroup.getAttribute('data-target-number'));

    if (draggedNumber === targetNumber) {
      AudioManager.play('correct');
      source.classList.add('matched');
      source.draggable = false;
      targetGroup.classList.add('matched');
      this.matchedGroups.add(targetNumber);

      if (this.matchedGroups.size === soal.numbers.length) {
        AudioManager.play('correct');
        setTimeout(() => {
          const responseTime = Date.now() - this.startTime;
          const points = Scoring.calculatePoints(true, this.streak, responseTime);
          this.currentScore += points;
          this.streak++;
          this.soals[this.soalIndex].answered = true;
          this.nextSoal();
        }, 600);
      }
    } else {
      AudioManager.play('wrong');
      targetGroup.classList.add('shake');
      setTimeout(() => targetGroup.classList.remove('shake'), 300);
    }
  }
}
