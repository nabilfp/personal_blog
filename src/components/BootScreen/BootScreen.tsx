import { useState, useEffect, useRef } from 'react';

interface BootScreenProps {
  onDone?: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.body.classList.add('is-booting');

    let displayPct = 0;
    let targetPct = 0;

    const setPct = (v: number) => setProgress(v);

    const crawl = () => {
      targetPct = Math.min(96, targetPct + 6);
      if (targetPct < 96) {
        window.setTimeout(crawl, reduce ? 30 : 90);
      } else {
        finishBoot();
      }
    };

    const tickPct = () => {
      displayPct += (targetPct - displayPct) * 0.14;
      setPct(displayPct);
      rafRef.current = requestAnimationFrame(tickPct);
    };

    let finished = false;
    const finishBoot = () => {
      if (finished) return;
      finished = true;
      targetPct = 100;
      setPct(100);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.setTimeout(() => {
        setDone(true);
        document.body.classList.remove('is-booting');
        onDone?.();
        window.setTimeout(() => setRemoved(true), 600);
      }, reduce ? 60 : 420);
    };

    rafRef.current = requestAnimationFrame(tickPct);
    window.setTimeout(crawl, reduce ? 0 : 200);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.classList.remove('is-booting');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (removed) return null;

  return (
    <div className={`boot ${done ? 'is-done' : ''}`} role="status" aria-label="Loading">
      <img src="images/profil.jpg" alt="" className="boot__img" draggable={false} />
      <div className="boot__bar"><span className="boot__bar-fill" style={{ right: `${100 - progress}%` }} /></div>
      <div className="boot__pct">{String(Math.round(progress)).padStart(3, '0')}</div>
    </div>
  );
};

export default BootScreen;