import { useState, useEffect } from 'react';
import ProfileCard from './components/react-bits/ProfileCard/ProfileCard';
import './App.css';

/* ─────────── dark-mode hook ─────────── */
function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return { dark, toggle: () => setDark(d => !d) };
}

/* ─────────── biodata data ─────────── */
const biodataItems = [
  { label: 'Nama',   value: 'Nabil Najwa Akmal' },
  { label: 'Asal',   value: 'Jombang, Jawa Timur' },
  { label: 'Umur',   value: '18 tahun' },
  { label: 'Alumni', value: 'SMA Negeri Jombang' },
  { label: 'Status', value: 'Mahasiswa' },
];

const contactItems = [
  { icon: '📱', label: 'WhatsApp', href: 'https://wa.me/6285213081416?text=Halo,%20saya%20ingin%20bertanya.', text: '085213081416' },
  { icon: '📧', label: 'Email',    href: 'mailto:nabilnajwaakmal02@gmail.com', text: 'nabilnajwaakmal02@gmail.com' },
  { icon: '📸', label: 'Instagram',href: 'https://www.instagram.com/naaaa.bl/', text: '@naaaa.bl' },
  { icon: '💻', label: 'GitHub',   href: 'https://github.com/nabilfp', text: 'github.com/nabilfp' },
];

/* ─────────── App ─────────── */
export default function App() {
  const { dark, toggle } = useDarkMode();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* ── NAVBAR ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Left: avatar + name */}
          <div className="flex items-center gap-3">
            <img
              src="images/profil.jpg"
              alt="Nabil Najwa Akmal"
              className="w-9 h-9 rounded-full object-cover border-2 border-blue-500"
            />
            <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Nabil Najwa Akmal</span>
          </div>

          {/* Right: logos + nav + theme toggle */}
          <nav className="flex items-center gap-3 sm:gap-4">
            <img src="images/univ-logo.webp" alt="Universitas Trunojoyo Madura" className="h-8 w-auto object-contain" title="Universitas Trunojoyo Madura" />
            <img src="images/ukm-logo.png"   alt="UKM Triple C"                className="h-8 w-auto object-contain" title="UKM Triple C" />
            <img src="images/logo.svg"        alt="Logo UTM"                    className="h-8 w-auto object-contain" title="Logo UTM" />

            <a href="#hero"    className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tentang</a>
            <a href="#biodata" className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Biodata</a>
            <a href="#contact" className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Kontak</a>

            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="ml-1 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-lg"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="hero" className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6">
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 py-16">

          {/* Profile card */}
          <div className="flex-shrink-0 flex justify-center">
            <ProfileCard
              avatarUrl="images/profil.jpg"
              miniAvatarUrl="images/profil.jpg"
              name=""
              title=""
              handle="nabilfp"
              status="Aktif"
              contactText="Kontak"
              enableTilt={true}
              onContactClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            />
          </div>

          {/* Hero text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
              Data Diri &amp; Biodata
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Halo, saya <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Nabil</span> 👋
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Saya berusia 18 tahun dan sangat menyukai teknologi, khususnya <strong className="text-gray-800 dark:text-gray-100">infrastruktur IT</strong>, administrasi sistem, dan keamanan siber. Saya sedang menempuh gelar di bidang Sistem Informasi dan aktif membangun fondasi kemampuan saya di dunia teknologi.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <a
                href="#biodata"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/40 transition-all duration-200 hover:-translate-y-0.5"
              >
                Lihat Biodata →
              </a>
              <a
                href="#contact"
                className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl shadow hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                Hubungi Saya
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── BIODATA ── */}
      <section id="biodata" className="py-20 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Biodata Diri</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {biodataItems.map((item) => (
              <div
                key={item.label}
                className="group relative bg-slate-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-blue-900/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="relative">
                  <span className="block text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">{item.label}</span>
                  <span className="block text-lg font-semibold text-gray-800 dark:text-white">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOGOS SECTION ── */}
      <section className="py-12 px-4 sm:px-6 bg-slate-50 dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-sm font-medium text-gray-400 dark:text-gray-500 mb-8 uppercase tracking-widest">Afiliasi</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-800 shadow border border-gray-100 dark:border-gray-700 flex items-center justify-center p-2 group-hover:shadow-md transition-shadow">
                <img src="images/univ-logo.webp" alt="Universitas Trunojoyo Madura" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-[80px]">Universitas Trunojoyo Madura</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-800 shadow border border-gray-100 dark:border-gray-700 flex items-center justify-center p-2 group-hover:shadow-md transition-shadow">
                <img src="images/ukm-logo.png" alt="UKM Triple C" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-[80px]">UKM Triple C</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-800 shadow border border-gray-100 dark:border-gray-700 flex items-center justify-center p-2 group-hover:shadow-md transition-shadow">
                <img src="images/logo.svg" alt="Logo UTM" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-[80px]">Logo UTM</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-20 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Kontak</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto" />
          </div>

          <div className="space-y-4">
            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 group"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">{item.label}</div>
                  <div className="text-gray-700 dark:text-gray-200 font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.text}</div>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-4 text-center bg-slate-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          © 2026 Data Diri — <span className="font-medium text-gray-600 dark:text-gray-400">Nabil Najwa Akmal</span>
        </p>
      </footer>

      {/* ── SCROLL TO TOP ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-200 dark:shadow-blue-900/40 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 z-50"
        aria-label="Scroll to top"
      >
        ↑
      </button>

    </div>
  );
}
