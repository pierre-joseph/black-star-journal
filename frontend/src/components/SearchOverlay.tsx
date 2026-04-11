import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  title: string;
  subtitle: string;
  href: string;
  cover?: string;
}

const SEARCHABLE_ITEMS: SearchResult[] = [
  { title: "Issue 01", subtitle: "February 2022", href: "/issues/01", cover: "/images/issue-covers/Issue-01.png" },
  { title: "Issue 02", subtitle: "April 2022", href: "/issues/02", cover: "/images/issue-covers/Issue-02.png" },
  { title: "Issue 03", subtitle: "November 2022", href: "/issues/03", cover: "/images/issue-covers/Issue-03.png" },
  { title: "Issue 04", subtitle: "February 2023", href: "/issues/04", cover: "/images/issue-covers/Issue-04.png" },
  { title: "Issue 05", subtitle: "October 2023", href: "/issues/05", cover: "/images/issue-covers/Issue-05.png" },
  { title: "Issue 06", subtitle: "December 2023", href: "/issues/06", cover: "/images/issue-covers/Issue-06.png" },
  { title: "Issue 07", subtitle: "March 2024", href: "/issues/07", cover: "/images/issue-covers/Issue-07.png" },
  { title: "Issue 08", subtitle: "April 2024", href: "/issues/08", cover: "/images/issue-covers/Issue-08.png" },
  { title: "Issue 09", subtitle: "October 2024", href: "/issues/09", cover: "/images/issue-covers/Issue-09.png" },
  { title: "Issue 10", subtitle: "February 2025", href: "/issues/10", cover: "/images/issue-covers/Issue-10.png" },
  { title: "Issue 11", subtitle: "April 2025", href: "/issues/11", cover: "/images/issue-covers/Issue-11.png" },
  { title: "Issue 12", subtitle: "September 2025", href: "/issues/12", cover: "/images/issue-covers/Issue-12.png" },
  { title: "Special Issue 01", subtitle: "June 2024", href: "/issues/SPECIAL", cover: "/images/issue-covers/Special Issue-01.png" },
  { title: "Our Team", subtitle: "Meet the team behind BSJ", href: "/team" },
  { title: "Sections", subtitle: "Browse by section", href: "/sections" },
  { title: "Events", subtitle: "BSJ community events and gatherings", href: "/events" },
  { title: "Archives", subtitle: "African Sun & historical publications", href: "/archives" },
  { title: "BSJ Issues", subtitle: "Browse all BSJ issues", href: "/issues" },
];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const results = query.trim()
    ? SEARCHABLE_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (href: string) => {
    navigate(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-background rounded-xl shadow-2xl border border-border overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search issues, pages..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
          />
          <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {query.trim() && (
          <div className="max-h-80 overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                No results for "{query}"
              </div>
            ) : (
              results.map((result) => (
                <button
                  key={result.href}
                  onClick={() => handleSelect(result.href)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  {result.cover && (
                    <img
                      src={result.cover}
                      alt=""
                      className="w-10 h-14 object-cover rounded shadow-sm shrink-0"
                    />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-foreground">{result.title}</div>
                    <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {!query.trim() && (
          <div className="px-4 py-6 text-center text-muted-foreground text-sm">
            Type to search across issues and pages
          </div>
        )}
      </div>
    </div>
  );
}
