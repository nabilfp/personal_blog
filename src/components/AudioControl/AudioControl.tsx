import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControlProps {
  src: string;
}

const VOL = 0.42;
// Gestures that grant autoplay activation (scroll/wheel do not).
const ARM = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'];

const AudioControl: React.FC<AudioControlProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [on, setOn] = useState(true);
  const wantedRef = useRef(true);
  const audibleRef = useRef(false);
  const armedRef = useRef(false);
  const fadeTimerRef = useRef<number | null>(null);
  const startedRef = useRef(false);

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
    setOn(stored === '1');

    const fadeTo = (target: number, done?: () => void) => {
      if (fadeTimerRef.current) window.clearInterval(fadeTimerRef.current);
      const step = (target - audio.volume) / 22;
      fadeTimerRef.current = window.setInterval(() => {
        let v = audio.volume + step;
        if ((step > 0 && v >= target) || (step < 0 && v <= target) || step === 0) {
          audio.volume = Math.max(0, Math.min(1, target));
          if (fadeTimerRef.current) window.clearInterval(fadeTimerRef.current);
          fadeTimerRef.current = null;
          done && done();
        } else {
          audio.volume = Math.max(0, Math.min(1, v));
        }
      }, 40);
    };

    const playFromStart = (): Promise<boolean> => {
      audio.muted = false;
      audio.volume = 0;
      audio.currentTime = 0;
      let p: Promise<void> | null = null;
      try {
        p = audio.play() || null;
      } catch {
        p = null;
      }
      const win = () => {
        startedRef.current = true;
        audibleRef.current = true;
        fadeTo(VOL);
        return true;
      };
      if (!p || !p.then) {
        return Promise.resolve(audio.paused ? false : win());
      }
      return p.then(win, () => false);
    };

    const shouldEnd = () => audibleRef.current && startedRef.current;

    const isButtonTarget = (event: Event): boolean => {
      const btn = buttonRef.current;
      if (!btn || !event.target) return false;
      return btn === event.target || btn.contains(event.target as Node);
    };

    const kick = (event: Event) => {
      if (isButtonTarget(event)) return;
      if (shouldEnd() || !wantedRef.current) {
        disarm();
        return;
      }
      playFromStart().then(ok => {
        if (ok) disarm();
      });
    };
    const arm = () => {
      if (armedRef.current) return;
      armedRef.current = true;
      ARM.forEach(t => window.addEventListener(t, kick, { capture: true, passive: true }));
    };
    const disarm = () => {
      if (!armedRef.current) return;
      armedRef.current = false;
      ARM.forEach(t => window.removeEventListener(t, kick, true));
    };

    // Always arm until the music is genuinely audible. Browsers block audible
    // autoplay on the first visit, so ANY subsequent click/tap/keypress starts it.
    wantedRef.current = stored === '1';
    audibleRef.current = false;
    startedRef.current = false;
    if (wantedRef.current) arm();

    // Also try immediately: works once the browser has granted autoplay
    // (e.g. the user interacted with the domain before).
    if (wantedRef.current) {
      playFromStart().then(ok => {
        if (!ok) arm();
      });
    }

    const onVisibility = () => {
      if (document.hidden) {
        if (audibleRef.current && !audio.paused) audio.pause();
      } else if (wantedRef.current && audibleRef.current && audio.paused) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (fadeTimerRef.current) window.clearInterval(fadeTimerRef.current);
      disarm();
      try {
        audio.pause();
      } catch {
        /* noop */
      }
      audio.src = '';
    };
  }, [src]);

  const playFromStart = (): Promise<boolean> => {
    const audio = audioRef.current;
    if (!audio) return Promise.resolve(false);
    audio.muted = false;
    audio.volume = 0;
    audio.currentTime = 0;
    let p: Promise<void> | null = null;
    try {
      p = audio.play() || null;
    } catch {
      p = null;
    }
    const win = () => {
      startedRef.current = true;
      audibleRef.current = true;
      setOn(true);
      const step = VOL / 22;
      if (fadeTimerRef.current) window.clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = window.setInterval(() => {
        if (audio.volume >= VOL - 0.01) {
          audio.volume = VOL;
          if (fadeTimerRef.current) window.clearInterval(fadeTimerRef.current);
          fadeTimerRef.current = null;
        } else {
          audio.volume += step;
        }
      }, 40);
      return true;
    };
    if (!p || !p.then) {
      return Promise.resolve(audio.paused ? false : win());
    }
    return p.then(win, () => false);
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Nothing audible yet -> the click is "play", not "toggle off".
    if (!audibleRef.current) {
      wantedRef.current = true;
      setOn(true);
      try {
        sessionStorage.setItem('kc_sound', '1');
      } catch {
        /* noop */
      }
      startedRef.current = false;
      playFromStart();
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
      startedRef.current = false;
      playFromStart();
    } else {
      startedRef.current = false;
      audibleRef.current = false;
      const step = -audio.volume / 22;
      if (fadeTimerRef.current) window.clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = window.setInterval(() => {
        audio.volume = Math.max(0, audio.volume + step);
        if (audio.volume <= 0.01) {
          audio.volume = 0;
          if (fadeTimerRef.current) window.clearInterval(fadeTimerRef.current);
          fadeTimerRef.current = null;
          audio.pause();
        }
      }, 40);
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