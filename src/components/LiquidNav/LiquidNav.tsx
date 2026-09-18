import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const ITEMS = [
  { href: '#hero', label: 'About' },
  { href: '#biodata', label: 'Profile' },
  { href: '#contact', label: 'Contact' },
];

interface LiquidNavProps {
  scrolled?: boolean;
}

export default function LiquidNav({ scrolled = false }: LiquidNavProps) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  const highlight = hovered ?? active;

  useLayoutEffect(() => {
    const measure = () => {
      const el = itemRefs.current[highlight];
      const list = listRef.current;
      if (!el || !list) return;
      const a = el.getBoundingClientRect();
      const b = list.getBoundingClientRect();
      setPill({ left: a.left - b.left, width: a.width });
    };

    measure();
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    if (document.fonts && 'ready' in document.fonts) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, [highlight]);

  useEffect(() => {
    const ids = ITEMS.map(i => i.href.slice(1));
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const i = ids.indexOf(entry.target.id);
            if (i >= 0) setActive(i);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3 sm:pt-4 pointer-events-none">
      <nav
        ref={listRef}
        onMouseLeave={() => setHovered(null)}
        className="pointer-events-auto relative flex items-center gap-1 rounded-full border border-white/15 p-1.5 transition-all duration-500"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.10) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: scrolled
            ? '0 14px 40px -12px rgba(0,0,0,0.75), 0 2px 8px -2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(255,255,255,0.08)'
            : '0 10px 30px -14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <span
          aria-hidden="true"
          className="absolute top-1.5 bottom-1.5 rounded-full"
          style={{
            left: pill ? `${pill.left}px` : 0,
            width: pill ? `${pill.width}px` : 0,
            opacity: pill ? 1 : 0,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.22) 100%)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(255,255,255,0.12), 0 6px 16px -6px rgba(0,0,0,0.6)',
            transition:
              'left 420ms cubic-bezier(0.34, 1.56, 0.64, 1), width 420ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease',
          }}
        />
        {ITEMS.map((item, i) => (
          <a
            key={item.href}
            ref={el => {
              itemRefs.current[i] = el;
            }}
            href={item.href}
            onMouseEnter={() => setHovered(i)}
            onFocus={() => setHovered(i)}
            className={`relative z-10 rounded-full px-4 sm:px-5 py-2 text-sm font-medium transition-colors duration-200 ${
              highlight === i ? 'text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
