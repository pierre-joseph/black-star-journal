import { Link } from "wouter";
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          {/* Links */}
          <div className="flex gap-6 flex-wrap justify-center">
            <Link href="/about" className="hover:text-gray-300 font-medium uppercase tracking-wider text-sm">About Us</Link>
            <Link href="/sections" className="hover:text-gray-300 font-medium uppercase tracking-wider text-sm">Sections</Link>
            <Link href="/archives" className="hover:text-gray-300 font-medium uppercase tracking-wider text-sm">Archives</Link>
          </div>

          {/* Socials */}
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/company/the-black-star-journal/" className="hover:text-blue-600 transition-colors"><FaLinkedin size={24} /></a>
            <a href="https://www.instagram.com/theblackstarjournal/" className="hover:text-pink-400 transition-colors"><FaInstagram size={24} /></a>
          </div>
        </div>

        <div className="h-px bg-white/10 w-full mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div>© 2026 The Black Star Journal. All rights reserved.</div>
          <div>Designed and developed by the BSJ Website Team.</div>
        </div>
      </div>
    </footer>
  );
}
