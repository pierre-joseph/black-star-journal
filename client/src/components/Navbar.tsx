import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import logo from '@assets/generated_images/black_star_journal_logo_in_orange_and_black.png';

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/about", label: "ABOUT US" },
    { href: "/sections", label: "SECTIONS" },
    { href: "/archives", label: "ARCHIVES" },
  ];

  return (
    <nav className="w-full border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        {/* Logo - Top Left Corner */}
        <Link href="/">
          <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="The Black Star Journal" className="h-16 w-auto" />
            <span className="font-heading font-black text-2xl tracking-tighter hidden lg:block">
              THE BLACK STAR JOURNAL
            </span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-sm font-semibold tracking-wide hover:text-primary/70 transition-colors",
                location === link.href ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
              )}
            >
                {link.label}
            </Link>
          ))}
          <Button variant="default" size="sm" className="font-bold">
            SUPPORT US
          </Button>
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
              href={link.href}
              className={cn(
                "block text-lg font-semibold py-2",
                location === link.href ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => setIsOpen(false)}
            >
                {link.label}
            </Link>
          ))}
          <Button className="w-full font-bold">SUPPORT US</Button>
        </div>
      )}
    </nav>
  );
}
