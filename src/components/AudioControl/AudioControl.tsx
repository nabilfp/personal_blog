import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControlProps {
  src: string;
}

const VOL = 0.42;
// Only gestures that actually grant autoplay activation. Scroll/wheel do NOT,
// so they are excluded (a first scroll used to fail silently).
const ARM = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'];

const AudioControl: React.FC<AudioControlProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

    const canStart = () => wantedRef.current && !startedRef.current;

    const tryStart = (): Promise<boolean> => {
      if (audibleRef.current || startedRef.current) return Promise.resolve(true);
      audio.muted = false;
      audio.volume = 0;
      audio.currentTime = 0;
      let p: Promise<void> | null = null;
      try {
        p = audio.play() || null;
      } catch {
        p = null;
      }
      const done = (ok: boolean) => {
        if (ok) {
          startedRef.current = true;
          audibleRef.current = true;
          fadeTo(VOL);
        }
        return ok;
      };
      if (!p || !p.then) {
        return Promise.resolve(audio.paused ? done(false) : done(true));
      }
      return p.then(
        () => done(true),
        () => done(false)
      );
    };

    const kick = () => {
      if (!canStart()) {
        disarm();
        return;
      }
      tryStart().then(ok => {
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

    // Try to start right away; only if the browser blocks it, wait for a
    // real activation gesture.
    if (canStart()) {
      tryStart().then(ok => {
        if (!ok) arm();
      });
    }

    const onVisibility = () => {
      if (document.hidden) {
        if (wantedRef.current && audibleRef.current && !audio.paused) audio.pause();
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

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const want = !wantedRef.current;
    wantedRef.current = want;
    setOn(want);
    try {
      sessionStorage.setItem('kc_sound', want ? '1' : '0');
    } catch {
      /* noop */
    }

    if (want) {
      if (!audibleRef.current && !startedRef.current) {
        audio.muted = false;
        audio.volume = 0;
        audio.currentTime = 0;
        const p = audio.play();
        const win = () => {
          startedRef.current = true;
          audibleRef.current = true;
          const step = VOL / 22;
          fadeTimerRef.current = window.setInterval(() => {
            if (audio.volume >= VOL - 0.01) {
              audio.volume = VOL;
              if (fadeTimerRef.current) window.clearInterval(fadeTimerRef.current);
              fadeTimerRef.current = null;
            } else {
              audio.volume += step;
            }
          }, 40);
        };
        if (p && p.then) p.then(win).catch(() => {});
        else if (!audio.paused) win();
      } else if (audio.paused) {
        audio.play().catch(() => {});
      }
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