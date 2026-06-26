/**
 * Retro Button Sound Effects
 * Adds press/release sounds to interactive buttons
 */
(function() {
  'use strict';

  // Audio elements
  const pressSound = new Audio('/assets/audio/button-press.MP3');
  const releaseSound = new Audio('/assets/audio/button-release.MP3');
  const errorSound = new Audio('/assets/audio/error-sound.mp3');

  // Preload for instant playback
  pressSound.preload = 'auto';
  releaseSound.preload = 'auto';
  errorSound.preload = 'auto';

  // Button selectors
  const SELECTORS = [
    '.btn--primary',
    '.btn--provider',
    '.accordion-header'
  ].join(', ');

  // Track touch to prevent double events on hybrid devices
  let touchActive = false;

  /**
   * Play audio with overlap prevention
   */
  function play(audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  /**
   * Handle press event
   */
  function handlePress(e) {
    // Skip mouse if touch just fired
    if (e.type === 'mousedown' && touchActive) {
      touchActive = false;
      return;
    }
    if (e.type === 'touchstart') {
      touchActive = true;
    }
    // Keyboard: only Enter or Space
    if (e.type === 'keydown') {
      if (e.key !== 'Enter' && e.key !== ' ') return;
    }
    play(pressSound);
  }

  /**
   * Handle release event
   */
  function handleRelease(e) {
    // Skip mouse if touch just fired
    if (e.type === 'mouseup' && touchActive) {
      touchActive = false;
      return;
    }
    if (e.type === 'touchend') {
      touchActive = false;
    }
    // Keyboard: only Enter or Space
    if (e.type === 'keyup') {
      if (e.key !== 'Enter' && e.key !== ' ') return;
    }
    play(releaseSound);
  }

  /**
   * Global function for form error handling
   */
  window.playErrorSound = function() {
    play(errorSound);
  };

  /**
   * Initialize sound effects on all matching buttons
   */
  function init() {
    const buttons = document.querySelectorAll(SELECTORS);

    buttons.forEach(button => {
      // Mouse events
      button.addEventListener('mousedown', handlePress);
      button.addEventListener('mouseup', handleRelease);

      // Touch events (passive for performance)
      button.addEventListener('touchstart', handlePress, { passive: true });
      button.addEventListener('touchend', handleRelease, { passive: true });

      // Keyboard events (for accessibility)
      button.addEventListener('keydown', handlePress);
      button.addEventListener('keyup', handleRelease);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
