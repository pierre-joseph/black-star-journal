import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToMission = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <footer className="w-full bg-slate-900 text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          {/* Links */}
          <div className="flex gap-6 flex-wrap justify-center">
            <a href="/#mission" onClick={scrollToMission} className="hover:text-gray-300 font-medium uppercase tracking-wider text-sm cursor-pointer">About Us</a>
            <Link to="/sections" className="hover:text-gray-300 font-medium uppercase tracking-wider text-sm">Sections</Link>
            <Link to="/archives" className="hover:text-gray-300 font-medium uppercase tracking-wider text-sm">Archives</Link>
          </div>

          {/* Socials */}
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/company/the-black-star-journal/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors" aria-label="LinkedIn"><FaLinkedin size={24} /></a>
            <a href="https://www.instagram.com/theblackstarjournal/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors" aria-label="Instagram"><FaInstagram size={24} /></a>
            <a href="mailto:blackstarjournal@brown.edu" className="hover:text-[#f97316] transition-colors" aria-label="Email"><FaEnvelope size={24} /></a>
          </div>
        </div>

        <div className="h-px bg-white/10 w-full mb-8" />

        <div className="text-center mb-6">
          <span className="text-white/30 text-[11px] font-serif italic tracking-[0.25em] uppercase">— Never settle —</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div>© 2026 The Black Star Journal. All rights reserved.</div>
          <div>Designed and developed by the BSJ Website Team.</div>
        </div>
      </div>
    </footer>
  );
}
