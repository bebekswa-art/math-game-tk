const UIManager = (() => {
  const templates = {
    titleScreen(state) {
      return `
        <div class="screen screen-title">
          <div class="title-content">
            <h1 class="title-logo">Permainan Matematika TK</h1>
            <div class="mascot-container">
              <img src="assets/images/mascot.png" alt="Maskot" class="mascot" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Ccircle cx=%22100%22 cy=%22100%22 r=%2280%22 fill=%22%23FFB6C1%22/%3E%3C/svg%3E'">
            </div>
            <p class="title-subtitle">Belajar berhitung dengan menyenangkan!</p>
            <button class="btn btn-primary btn-large" id="btn-start">
              Mulai
            </button>
          </div>
        </div>
      `;
    },

    levelSelectScreen(state) {
       const levelCards = state.levels.map(level => {
         const isUnlocked = state.totalScore >= level.unlockThreshold;
         const levelScore = state.levelScores?.[level.id] || 0;
         
         return `
           <div class="level-card ${isUnlocked ? 'unlocked' : 'locked'}">
             ${!isUnlocked ? '<div class="lock-icon">🔒</div>' : ''}
             <div class="level-header">
               <h3>Level ${level.id}</h3>
               <span class="difficulty difficulty-${level.difficulty}">${level.difficulty}</span>
             </div>
             <p class="level-name">${level.name}</p>
             <p class="level-score">Skor: ${levelScore}</p>
             <button 
               class="btn btn-secondary level-btn" 
               onclick="window.GameApp.startGame(${level.id})"
               ${!isUnlocked ? 'disabled' : ''}
             >
               ${isUnlocked ? 'Mainkan' : 'Terkunci'}
             </button>
           </div>
         `;
       }).join('');

       const displayName = state.childName || 'Pemain';

       return `
         <div class="screen screen-level-select">
           <div class="level-select-header">
             <h1>Pilih Level</h1>
             <p class="player-name">${displayName}</p>
             <p class="total-score">Total Skor: <span>${state.totalScore}</span></p>
           </div>
           <div class="levels-grid">
             ${levelCards}
           </div>
           <button class="btn btn-primary" id="btn-back-home">
             Kembali
           </button>
         </div>
       `;
     },

    gameScreen(state) {
      const currentLevel = state.levels.find(l => l.id === state.currentLevel);
      const currentQuestion = state.currentGameState?.soalIndex + 1 || 1;
      const totalQuestions = currentLevel?.soalCount || 5;
      const progressPercent = (currentQuestion / totalQuestions) * 100;

      return `
        <div class="screen screen-game">
          <div class="game-hud">
            <div class="hud-left">
              <div class="level-indicator">
                Level <span>${state.currentLevel}</span>
              </div>
              <div class="score-counter">
                Skor: <span>${state.currentGameState?.score || 0}</span>
              </div>
            </div>
            <div class="hud-right">
              <button class="btn btn-small btn-secondary" id="btn-hint" disabled title="Hint">
                💡
              </button>
              <button class="btn btn-small btn-secondary" id="btn-sound">
                🔊
              </button>
            </div>
          </div>

          <div class="game-title">
            <h2>${currentLevel?.name}</h2>
          </div>

          <div id="game-area" class="game-area">
            <!-- Game content rendered here -->
          </div>

          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercent}%"></div>
            <p class="progress-text">Soal ${currentQuestion} dari ${totalQuestions}</p>
          </div>
        </div>
      `;
    },

    resultsScreen(state) {
      const result = state.currentGameState?.lastResult || {};
      const isCorrect = result.isCorrect;
      const points = result.points || 0;
      const stars = calculateStars(state.currentGameState?.streak || 0, state.currentGameState?.accuracy || 0);
      const currentQuestion = state.currentGameState?.soalIndex + 1 || 1;
      const totalQuestions = state.levels.find(l => l.id === state.currentLevel)?.soalCount || 5;
      const isLastQuestion = currentQuestion >= totalQuestions;

      const starDisplay = Array(3).fill('☆').map((_, i) => i < stars ? '★' : '☆').join('');

      return `
        <div class="screen screen-results">
          <div class="results-content">
            <div class="results-feedback ${isCorrect ? 'correct' : 'incorrect'}">
              <h1>${isCorrect ? 'Benar!' : 'Salah'}</h1>
              <p class="feedback-message">
                ${isCorrect ? 'Jawaban kamu benar!' : 'Coba lagi'}
              </p>
            </div>

            <div class="results-points">
              <p class="points-label">Poin Diperoleh</p>
              <p class="points-value">${points}</p>
            </div>

            <div class="results-stars">
              <p class="stars-label">Bintang</p>
              <p class="stars-display">${starDisplay}</p>
            </div>

            <div class="results-actions">
              ${!isLastQuestion ? `
                <button class="btn btn-primary btn-large" id="btn-next-question">
                  Lanjut ke Soal Berikutnya
                </button>
              ` : `
                <button class="btn btn-primary btn-large" id="btn-next-level">
                  Lanjut ke Level Berikutnya
                </button>
              `}
              <button class="btn btn-accent btn-large" id="btn-restart-level">
                Ulang Level
              </button>
            </div>
          </div>
        </div>
      `;
    }
  };

  function calculateStars(streak, accuracy) {
    if (accuracy >= 0.8) return 3;
    if (accuracy >= 0.5) return 2;
    if (accuracy > 0) return 1;
    return 0;
  }

  function attachEventListeners(screenName, state) {
    if (screenName === 'title') {
      const startBtn = document.getElementById('btn-start');
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          const name = prompt('Siapa nama kamu?', 'Anak');
          if (name && name.trim()) {
            state.childName = name.trim();
            state.save?.();
          }
          window.GameApp.showScreen('levels');
        });
      }
    } else if (screenName === 'levelSelect' || screenName === 'levels') {
      const backBtn = document.getElementById('btn-back-home');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          window.GameApp.showScreen('title');
        });
      }
    } else if (screenName === 'game') {
      const hintBtn = document.getElementById('btn-hint');
      const soundBtn = document.getElementById('btn-sound');

      if (soundBtn) {
        soundBtn.addEventListener('click', () => {
          AudioManager.toggleMute();
        });
      }
    } else if (screenName === 'results') {
      const nextQuestionBtn = document.getElementById('btn-next-question');
      const nextLevelBtn = document.getElementById('btn-next-level');
      const restartBtn = document.getElementById('btn-restart-level');

      if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', () => {
          window.GameApp.nextQuestion?.();
        });
      }

      if (nextLevelBtn) {
        nextLevelBtn.addEventListener('click', () => {
          window.GameApp.nextLevel?.();
        });
      }

      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          window.GameApp.startGame(state.currentLevel);
        });
      }
    }
  }

  return {
    async render(screenName, state) {
      const container = document.getElementById('app-container');
      if (!container) {
        console.error('App container not found');
        return;
      }

      let template = '';

      switch (screenName) {
        case 'title':
        case 'home':
          template = templates.titleScreen(state);
          break;
        case 'levelSelect':
        case 'levels':
          template = templates.levelSelectScreen(state);
          break;
        case 'game':
          template = templates.gameScreen(state);
          break;
        case 'results':
          template = templates.resultsScreen(state);
          break;
        default:
          console.warn(`Unknown screen: ${screenName}`);
          return;
      }

      container.innerHTML = template;
      attachEventListeners(screenName, state);
    }
  };
})();
