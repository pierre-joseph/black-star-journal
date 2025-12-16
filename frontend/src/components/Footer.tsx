import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

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
            <a href="#" className="hover:text-blue-400 transition-colors"><Facebook size={24} /></a>
            <a href="#" className="hover:text-sky-400 transition-colors"><Twitter size={24} /></a>
            <a href="#" className="hover:text-pink-400 transition-colors"><Instagram size={24} /></a>
            <a href="#" className="hover:text-red-500 transition-colors"><Youtube size={24} /></a>
          </div>
        </div>

        <div className="h-px bg-white/10 w-full mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div>© 2025 The Black Star Journal. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Terms of Use</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
