import { useState, useEffect } from 'react';
import { Phone, Mail, Smartphone, Sun, Moon, Sparkles } from 'lucide-react';
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
  { label: 'Alumni', value: 'SMA Negeri Bareng' },
  { label: 'Status', value: 'Mahasiswa' },
];

const contactItems = [
  { icon: Phone, label: 'WhatsApp', href: 'https://wa.me/6285213081416?text=AKU%20PENDUKUNG%20ISRAEL%20DAN%20AKU%20BANGGA%20%23LARPINGFINALBOS%23AKUTRIPLECLAH', text: '085213081416' },
  { icon: Mail, label: 'Email',    href: 'mailto:nabilnajwaakmal02@gmail.com', text: 'nabilnajwaakmal02@gmail.com' },
  { icon: Smartphone, label: 'Instagram', href: 'https://www.instagram.com/naaaa.bl/', text: '@naaaa.bl' },
  { icon: GithubIcon, label: 'GitHub',   href: 'https://github.com/nabilfp', text: 'github.com/nabilfp' },
];

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

/* ─────────── App ─────────── */
export default function App() {
  const { dark, toggle } = useDarkMode();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement;
      setScrolled(window.scrollY > 40);
      if (window.scrollY > 40) {
        document.body.classList.add('scrolled');
      } else {
        document.body.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 transition-colors duration-300 relative overflow-hidden">

      {/* ── CINEMATIC BACKDROP ── */}
      <div className="backdrop" aria-hidden="true" />

      {/* ── DECORATIVE STARS & DVD ── */}
      <img src="assets/el/opt_star-a.webp" alt="" className="el el--star-a" aria-hidden="true" decoding="async" width="481" height="603" />
      <img src="assets/el/opt_star-b.webp" alt="" className="el el--star-b" aria-hidden="true" decoding="async" width="1167" height="1170" />
      <img src="assets/el/opt_cd-a.webp" alt="" className="el el--dvd" aria-hidden="true" decoding="async" width="794" height="726" />

      {/* ── NAVBAR ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Left: avatar + name */}
          <div className="flex items-center gap-3">
            <img
              src="images/profil.jpg"
              alt="Nabil Najwa Akmal"
              className="w-9 h-9 rounded-full object-cover border-2 border-white/20"
            />
            <span className="font-bold text-white text-sm sm:text-base">Nabil Najwa Akmal</span>
          </div>

          {/* Right: logos + nav + theme toggle */}
          <nav className="flex items-center gap-3 sm:gap-4">
            <img src="images/univ-logo.webp" alt="Universitas Trunojoyo Madura" className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" loading="lazy" decoding="async" title="Universitas Trunojoyo Madura" />
            <img src="images/ukm-logo.png"   alt="UKM Triple C"                className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" loading="lazy" decoding="async" title="UKM Triple C" />
            <img src="images/logo.svg"        alt="Logo UTM"                    className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" loading="lazy" decoding="async" title="Logo UTM" />

            <a href="#hero"    className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors">Tentang</a>
            <a href="#biodata" className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors">Biodata</a>
            <a href="#contact" className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors">Kontak</a>

            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="ml-1 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-lg"
            >
              {dark ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-400" />}
            </button>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="hero" className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 relative">
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
            <div className="inline-block bg-white/10 border border-white/15 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
              Data Diri &amp; Biodata
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Halo, saya <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">Nabil</span> <Sparkles className="inline-block text-gray-300 mb-1" />
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Saya berusia 18 tahun dan sangat menyukai teknologi, khususnya <strong className="text-white">infrastruktur IT</strong>, administrasi sistem, dan keamanan siber. Saya sedang menempuh gelar di bidang Sistem Informasi dan aktif membangun fondasi kemampuan saya di dunia teknologi.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <a
                href="#biodata"
                className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl shadow-lg shadow-black/40 hover:bg-gray-200 transition-all duration-200 hover:-translate-y-0.5"
              >
                Lihat Biodata →
              </a>
              <a
                href="#contact"
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl shadow hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                Hubungi Saya
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── BIODATA ── */}
      <section id="biodata" className="py-20 px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Biodata Diri</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {biodataItems.map((item) => (
              <div
                key={item.label}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="relative">
                  <span className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{item.label}</span>
                  <span className="block text-lg font-semibold text-white">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOGOS SECTION ── */}
      <section className="py-12 px-4 sm:px-6 relative border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-sm font-medium text-gray-500 mb-8 uppercase tracking-widest">Afiliasi</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center p-2 group-hover:shadow-lg group-hover:shadow-black/30 transition-shadow">
                <img src="images/univ-logo.webp" alt="Universitas Trunojoyo Madura" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs text-gray-500 text-center max-w-[80px]">Universitas Trunojoyo Madura</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center p-2 group-hover:shadow-lg group-hover:shadow-black/30 transition-shadow">
                <img src="images/ukm-logo.png" alt="UKM Triple C" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs text-gray-500 text-center max-w-[80px]">UKM Triple C</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center p-2 group-hover:shadow-lg group-hover:shadow-black/30 transition-shadow">
                <img src="images/robot.svg" alt="robot" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs text-gray-500 text-center max-w-[80px]">robot.svg</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-20 px-4 sm:px-6 relative">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Kontak</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mx-auto" />
          </div>

          <div className="space-y-4">
            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-4 p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 hover:shadow-lg hover:shadow-black/30 transition-all duration-200 group"
              >
                <item.icon className="text-2xl flex-shrink-0 text-gray-400 group-hover:text-white transition-colors" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{item.label}</div>
                  <div className="text-gray-300 font-medium truncate group-hover:text-white transition-colors">{item.text}</div>
                </div>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-white flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-4 text-center border-t border-white/5">
        <p className="text-sm text-gray-500">
          © 2026 Data Diri — <span className="font-medium text-gray-400">Nabil Najwa Akmal</span>
        </p>
      </footer>

      {/* ── SCROLL TO TOP ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-11 h-11 bg-white text-gray-900 hover:bg-gray-200 rounded-full shadow-lg shadow-black/40 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 z-50"
        aria-label="Scroll to top"
      >
        ↑
      </button>

    </div>
  );
}
