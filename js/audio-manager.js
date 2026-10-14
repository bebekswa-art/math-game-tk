const AudioManager = (() => {
  const soundEnabled = true;

  return {
    play(soundName) {
      if (!soundEnabled) return;
    },

    toggle() {
      // Sound toggle
    }
  };
})();
