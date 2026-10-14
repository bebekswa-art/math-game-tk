const AudioManager = (() => {
  const state = {
    sounds: {},
    muted: false,
    lastPlayTime: {},
    audioContext: null
  };

  const THROTTLE_MS = 200;
  const MUTE_STORAGE_KEY = 'mathgame_muted';

  const soundDefinitions = {
    drop: { duration: 0.2, frequency: 800, type: 'sine' },
    correct: { duration: 0.3, frequency: 1000, type: 'sine' },
    wrong: { duration: 0.2, frequency: 400, type: 'sine' },
    'level-complete': { duration: 0.5, frequency: 1200, type: 'sine' },
    'bg-music': { duration: 2, frequency: 600, type: 'sine', loop: true }
  };

  function initAudioContext() {
    if (state.audioContext) return state.audioContext;
    
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      console.warn('Web Audio API not supported');
      return null;
    }

    state.audioContext = new AudioCtx();
    if (state.audioContext.state === 'suspended') {
      document.addEventListener('click', () => {
        state.audioContext?.resume();
      }, { once: true });
    }
    return state.audioContext;
  }

  function generateToneBuffer(frequency, duration) {
    const ctx = state.audioContext;
    if (!ctx) return null;

    const sampleRate = ctx.sampleRate;
    const samples = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, samples, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      data[i] = Math.sin(2 * Math.PI * frequency * t) * 0.3;
    }

    return buffer;
  }

  function playTone(soundName) {
    const ctx = state.audioContext;
    if (!ctx || state.muted) return;

    const def = soundDefinitions[soundName];
    if (!def) return;

    try {
      const now = Date.now();
      const lastTime = state.lastPlayTime[soundName] || 0;

      if (now - lastTime < THROTTLE_MS) {
        return;
      }

      state.lastPlayTime[soundName] = now;

      if (!state.sounds[soundName]) {
        state.sounds[soundName] = generateToneBuffer(def.frequency, def.duration);
      }

      const buffer = state.sounds[soundName];
      if (!buffer) return;

      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();

      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      gainNode.gain.value = 0.3;

      if (def.loop) {
        source.loop = true;
        source.start(0);
        state.sounds[soundName + '_source'] = source;
      } else {
        source.start(0);
      }
    } catch (err) {
      console.warn(`Failed to play sound ${soundName}:`, err);
    }
  }

  function stopLoopingSound(soundName) {
    const source = state.sounds[soundName + '_source'];
    if (source) {
      try {
        source.stop();
      } catch (err) {
        console.warn(`Failed to stop sound ${soundName}:`, err);
      }
      delete state.sounds[soundName + '_source'];
    }
  }

  function loadMuteState() {
    const stored = localStorage.getItem(MUTE_STORAGE_KEY);
    return stored === 'true';
  }

  function saveMuteState() {
    localStorage.setItem(MUTE_STORAGE_KEY, state.muted);
  }

  function updateMuteButton() {
    const soundBtn = document.getElementById('btn-sound');
    if (soundBtn) {
      soundBtn.textContent = state.muted ? '🔇' : '🔊';
      soundBtn.title = state.muted ? 'Suara Mati' : 'Suara Nyala';
    }
  }

  return {
    async init() {
      try {
        initAudioContext();
        state.muted = loadMuteState();
        
        Object.keys(soundDefinitions).forEach(soundName => {
          const def = soundDefinitions[soundName];
          state.sounds[soundName] = generateToneBuffer(def.frequency, def.duration);
        });

        updateMuteButton();
        console.log('AudioManager initialized');
      } catch (err) {
        console.warn('AudioManager initialization failed:', err);
      }
    },

    play(soundName) {
      if (!soundName || state.muted) return;
      if (!soundDefinitions[soundName]) {
        console.warn(`Unknown sound: ${soundName}`);
        return;
      }
      playTone(soundName);
    },

    stop(soundName) {
      if (!soundName) return;
      if (soundDefinitions[soundName]?.loop) {
        stopLoopingSound(soundName);
      }
    },

    toggleMute() {
      state.muted = !state.muted;
      saveMuteState();
      updateMuteButton();
      return state.muted;
    },

    isMuted() {
      return state.muted;
    },

    setMuted(value) {
      state.muted = Boolean(value);
      saveMuteState();
      updateMuteButton();
    }
  };
})();
