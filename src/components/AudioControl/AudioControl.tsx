import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControlProps {
  src: string;
}

const VOL = 0.42;
const ARM = ['pointerdown', 'pointerup', 'click', 'keydown', 'touchstart', 'touchend', 'wheel', 'scroll'];

const AudioControl: React.FC<AudioControlProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [on, setOn] = useState(false);
  const wantedRef = useRef(false);
  const audibleRef = useRef(false);
  const armedRef = useRef(false);
  const fadeTimerRef = useRef<number | null>(null);
  const inFlightRef = useRef<Promise<boolean> | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.playsInline = true;
    audioRef.current = audio;

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

    const rollSilently = () => {
      audio.muted = true;
      audio.volume = 0;
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
    };

    const goAudible = (): Promise<boolean> => {
      if (audibleRef.current) return Promise.resolve(true);
      if (inFlightRef.current) return inFlightRef.current;

      const wasMuted = audio.muted;
      audio.muted = false;
      if (wasMuted) {
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
      const settle = (ok: boolean) => {
        inFlightRef.current = null;
        return ok;
      };
      const win = () => {
        audibleRef.current = true;
        fadeTo(VOL);
        return settle(true);
      };
      const lose = () => {
        audio.muted = wasMuted;
        if (wasMuted && audio.paused) rollSilently();
        return settle(false);
      };
      if (!p || !p.then) return Promise.resolve(audio.paused ? lose() : win());
      inFlightRef.current = p.then(win, lose);
      return inFlightRef.current;
    };

    const kick = () => {
      if (!wantedRef.current || audibleRef.current) {
        disarm();
        return;
      }
      goAudible().then(ok => {
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

    const setSound = (want: boolean) => {
      wantedRef.current = want;
      setOn(want);
      try {
        sessionStorage.setItem('kc_sound', want ? '1' : '0');
      } catch {
        /* noop */
      }
      if (want) {
        goAudible().then(ok => {
          if (!ok) {
            rollSilently();
            arm();
          }
        });
      } else {
        audibleRef.current = false;
        disarm();
        fadeTo(0, () => audio.pause());
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (audio && !audio.paused && wantedRef.current) {
          audio.pause();
        }
      } else if (wantedRef.current && audibleRef.current && audio.paused) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // restore per-session preference, silently rolling to warm buffer
    let stored = '0';
    try {
      stored = sessionStorage.getItem('kc_sound') || '0';
    } catch {
      /* noop */
    }
    if (stored === '1') {
      rollSilently();
      arm();
    } else {
      rollSilently();
    }

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

    const goAudible = (): Promise<boolean> => {
      if (audibleRef.current) return Promise.resolve(true);
      const wasMuted = audio.muted;
      audio.muted = false;
      if (wasMuted) {
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
        return true;
      };
      const fadeOut = (done?: () => void) => {
        if (fadeTimerRef.current) window.clearInterval(fadeTimerRef.current);
        const step = -audio.volume / 22;
        fadeTimerRef.current = window.setInterval(() => {
          audio.volume = Math.max(0, audio.volume + step);
          if (audio.volume <= 0.01) {
            audio.volume = 0;
            if (fadeTimerRef.current) window.clearInterval(fadeTimerRef.current);
            fadeTimerRef.current = null;
            audio.pause();
            done && done();
          }
        }, 40);
      };
      if (!p || !p.then) {
        if (audio.paused) return Promise.resolve(false);
        fadeOut();
        audibleRef.current = false;
        return Promise.resolve(false);
      }
      inFlightRef.current = p.then(
        () => {
          win();
          return true;
        },
        () => false
      );
      return inFlightRef.current;
    };

    if (want) {
      goAudible();
    } else {
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