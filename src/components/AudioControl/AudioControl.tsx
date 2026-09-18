import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControlProps {
  src: string;
}

const VOL = 0.42;
// Gestures that grant activation (scroll/wheel do not).
const GESTURES = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'];

const AudioControl: React.FC<AudioControlProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [on, setOn] = useState(true);

  const wantedRef = useRef(true);
  const audibleRef = useRef(false);
  const startingRef = useRef(false);
  const fadeTimerRef = useRef<number | null>(null);
  const detachRef = useRef<(() => void) | null>(null);

  const clearFade = () => {
    if (fadeTimerRef.current !== null) {
      window.clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  const fadeTo = (target: number, done?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    clearFade();
    const step = (target - audio.volume) / 22;
    if (step === 0) {
      audio.volume = target;
      done?.();
      return;
    }
    fadeTimerRef.current = window.setInterval(() => {
      const v = audio.volume + step;
      if ((step > 0 && v >= target) || (step < 0 && v <= target)) {
        audio.volume = Math.max(0, Math.min(1, target));
        clearFade();
        done?.();
      } else {
        audio.volume = Math.max(0, Math.min(1, v));
      }
    }, 40);
  };

  // Play with sound from the start. Succeeds when the browser allows autoplay
  // (site reputation / prior interaction) or when called inside a gesture.
  const playAudible = (restart: boolean): Promise<boolean> => {
    const audio = audioRef.current;
    if (!audio) return Promise.resolve(false);
    audio.muted = false;
    if (restart) {
      try {
        audio.currentTime = 0;
      } catch {
        /* noop */
      }
    }
    audio.volume = 0;
    let p: Promise<void> | null = null;
    try {
      p = audio.play() || null;
    } catch {
      p = null;
    }
    const win = () => {
      audibleRef.current = true;
      setOn(true);
      fadeTo(VOL);
      return true;
    };
    if (!p) return Promise.resolve(audio.paused ? false : win());
    return p.then(win, () => false);
  };

  // Muted playback is always allowed: prime the track so a blocked first visit
  // can simply unmute on the first interaction.
  const playPrimed = (): Promise<boolean> => {
    const audio = audioRef.current;
    if (!audio) return Promise.resolve(false);
    audio.muted = true;
    audio.volume = 0;
    let p: Promise<void> | null = null;
    try {
      p = audio.play() || null;
    } catch {
      p = null;
    }
    if (!p) return Promise.resolve(!audio.paused);
    return p.then(() => true, () => false);
  };

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.playsInline = true;
    audioRef.current = audio;

    let stored = '1';
    try {
      stored = sessionStorage.getItem('kc_sound') || '1';
    } catch {
      /* noop */
    }
    wantedRef.current = stored === '1';
    audibleRef.current = false;
    startingRef.current = false;
    setOn(stored === '1');

    const isButtonTarget = (event: Event): boolean => {
      const btn = buttonRef.current;
      const target = event.target as Node | null;
      if (!btn || !target) return false;
      return btn === target || btn.contains(target);
    };

    const detach = () => {
      if (!detachRef.current) return;
      detachRef.current();
      detachRef.current = null;
    };

    const start = (restart: boolean) => {
      if (startingRef.current) return;
      startingRef.current = true;
      playAudible(restart).then(ok => {
        startingRef.current = false;
        if (ok) detach();
      });
    };

    const unlock = (event: Event) => {
      if (isButtonTarget(event)) return;
      if (!wantedRef.current) return;
      if (audibleRef.current && !audio.paused) {
        detach();
        return;
      }
      start(true);
    };

    const arm = () => {
      if (detachRef.current) return;
      GESTURES.forEach(type =>
        window.addEventListener(type, unlock, { capture: true, passive: true })
      );
      detachRef.current = () => {
        GESTURES.forEach(type => window.removeEventListener(type, unlock, true));
      };
    };

    if (wantedRef.current) {
      playAudible(false).then(ok => {
        if (ok) return; // autoplay allowed
        playPrimed(); // blocked: keep the track ready, muted
        arm(); // and start for real on the first interaction
      });
    }

    const onVisibility = () => {
      if (document.hidden) {
        if (audibleRef.current && !audio.paused) audio.pause();
      } else if (wantedRef.current && audibleRef.current && audio.paused) {
        audio.muted = false;
        try {
          audio.play();
        } catch {
          /* noop */
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      clearFade();
      detach();
      try {
        audio.pause();
      } catch {
        /* noop */
      }
      audio.src = '';
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Nothing audible yet -> the click means "play", not "toggle off".
    if (!audibleRef.current) {
      wantedRef.current = true;
      setOn(true);
      try {
        sessionStorage.setItem('kc_sound', '1');
      } catch {
        /* noop */
      }
      if (startingRef.current) return;
      startingRef.current = true;
      playAudible(true).then(ok => {
        startingRef.current = false;
        if (ok && detachRef.current) {
          detachRef.current();
          detachRef.current = null;
        }
      });
      return;
    }

    const want = !wantedRef.current;
    wantedRef.current = want;
    setOn(want);
    try {
      sessionStorage.setItem('kc_sound', want ? '1' : '0');
    } catch {
      /* noop */
    }

    if (want) {
      audio.muted = false;
      fadeTo(VOL);
      try {
        audio.play();
      } catch {
        /* noop */
      }
    } else {
      audibleRef.current = false;
      fadeTo(0, () => {
        try {
          audio.pause();
        } catch {
          /* noop */
        }
      });
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={toggle}
      className="audio-toggle"
      aria-label={on ? 'Turn music off' : 'Turn music on'}
      aria-pressed={on}
      title={on ? 'Music on' : 'Music off'}
    >
      {on ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </button>
  );
};

export default AudioControl;
