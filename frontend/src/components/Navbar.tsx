import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "@/components/SearchOverlay";

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('bsj-dark') === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('bsj-dark', String(dark));
  }, [dark]);

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/team", label: "OUR TEAM" },
    { href: "/sections", label: "SECTIONS" },
    { href: "/bsjissues", label: "BSJ ISSUES" },
    { href: "/archives", label: "ARCHIVES" }
  ];

  return (
    <>
    <nav className="w-full bg-background pt-8 pb-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo - Top Left Corner */}
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <img src="/images/logo.png" alt="The Black Star Journal" className="h-16 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 ml-auto">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              to={link.href}
              className={cn(
                "text-xs font-bold tracking-widest uppercase hover:text-primary transition-colors",
                location.pathname === link.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            className="p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              to={link.href}
              className={cn(
                "block text-lg font-semibold py-2",
                location.pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
