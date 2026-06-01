const SOUND_ENABLED_KEY = 'botguard_notification_sound';

let audioContext = null;

const getAudioContext = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioContext) {
    audioContext = new AudioCtx();
  }
  return audioContext;
};

/** Call after a user gesture so later socket sounds can play. */
export const unlockNotificationAudio = async () => {
  const ctx = getAudioContext();
  if (ctx?.state === 'suspended') {
    await ctx.resume();
  }
};

export const isNotificationSoundEnabled = () => {
  if (typeof localStorage === 'undefined') return true;
  return localStorage.getItem(SOUND_ENABLED_KEY) !== 'false';
};

export const setNotificationSoundEnabled = (enabled) => {
  localStorage.setItem(SOUND_ENABLED_KEY, enabled ? 'true' : 'false');
};

const playTone = (ctx, critical) => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = critical ? 920 : 720;
  oscillator.type = 'sine';

  const peak = critical ? 0.35 : 0.25;
  const duration = critical ? 0.35 : 0.25;

  gainNode.gain.setValueAtTime(peak, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);

  if (critical) {
    const oscillator2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    oscillator2.connect(gain2);
    gain2.connect(ctx.destination);
    oscillator2.frequency.value = 1100;
    oscillator2.type = 'sine';
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    oscillator2.start(ctx.currentTime + 0.12);
    oscillator2.stop(ctx.currentTime + 0.45);
  }
};

/**
 * Short alert tone for new notifications (Web Audio API).
 * @param {boolean} critical - Louder tone for critical alerts
 */
export const playNotificationSound = async (critical = false) => {
  if (!isNotificationSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (ctx.state !== 'running') return;

    playTone(ctx, critical);
  } catch {
    /* audio optional */
  }
};
