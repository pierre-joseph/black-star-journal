import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/team", label: "OUR TEAM" },
    { href: "/sections", label: "SECTIONS" },
    { href: "/archives", label: "ARCHIVES" },
    { href: "/contact", label: "CONTACT US" },
  ];

  return (
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
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
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
  );
}
