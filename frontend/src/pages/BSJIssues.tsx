import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { backendApiUrl, resolveR2AssetUrl } from "@/lib/api";

interface Media {
  filename?: string | null;
  url?: string | null;
  alt?: string | null;
}

interface Issue {
  id: string;
  title: string;
  slug: string;
  issueNumber: number;
  publishDate: string;
  coverArtwork?: Media | string | null;
  coverImage?: Media | string | null;
  fullPdf?: Media | string | null;
}

const isSpecialIssue = (issue: Issue): boolean =>
  issue.issueNumber <= 0 ||
  (issue.slug || "").toLowerCase().includes("special") ||
  (issue.title || "").toLowerCase().includes("special");

const sortIssuesForTimeline = (items: Issue[]): Issue[] => {
  return [...items].sort((a, b) => {
    const aSpecial = isSpecialIssue(a);
    const bSpecial = isSpecialIssue(b);

    if (aSpecial !== bSpecial) {
      return aSpecial ? 1 : -1;
    }

    return a.issueNumber - b.issueNumber;
  });
};

const getIssueRouteId = (issue: Issue): string => {
  const slug = issue.slug?.trim();

  if (slug) {
    return slug;
  }

  if (isSpecialIssue(issue)) {
    return "special";
  }

  return String(issue.issueNumber).padStart(2, "0");
};

export default function BSJIssues() {
  usePageTitle('BSJ Issues');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadIssues = async () => {
      setLoadingIssues(true);

      try {
        const response = await fetch(backendApiUrl("/api/bsjissues?sort=issueNumber&limit=200&depth=1"));

        if (!response.ok) {
          throw new Error(`Failed to fetch BSJ issues: ${response.status}`);
        }

        const data = await response.json();
        const docs = Array.isArray(data?.docs) ? (data.docs as Issue[]) : [];

        if (!mounted) return;
        setIssues(sortIssuesForTimeline(docs));
      } catch (error) {
        if (mounted) {
          console.error("Error fetching BSJ issues:", error);
          setIssues([]);
        }
      } finally {
        if (mounted) {
          setLoadingIssues(false);
        }
      }
    };

    loadIssues();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* HERO */}
      <section className="bg-[#f97316] py-24 text-center">
        <div className="container mx-auto px-4">
          <p className="text-white/70 text-sm font-bold tracking-widest uppercase mb-4">Since 2021</p>
          <h1 className="font-heading font-black text-5xl md:text-8xl mb-6 text-white leading-tight">THE FULL BSJ ISSUES</h1>
          <div className="w-24 h-1 bg-white/40 mx-auto mb-6" />
          <p className="font-serif text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Explore our collection of past issues — stories, art, and voices that have shaped our community at Brown.
          </p>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-heading font-bold text-2xl mb-12 uppercase tracking-widest">Past BSJ Issues</h2>
          <div className="overflow-x-auto pb-8">
            <div className="relative inline-flex gap-12 px-8 min-w-full">
              {/* Timeline spine */}
              <div className="absolute top-[240px] left-0 right-0 h-1 bg-primary/30" />

              {issues.map((issue, index) => {
                const isEven = index % 2 === 0;
                const dateStr = new Date(issue.publishDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                const coverImageUrl =
                  resolveR2AssetUrl(issue.coverArtwork) ??
                  resolveR2AssetUrl(issue.coverImage);
                const issueRouteId = getIssueRouteId(issue);

                return (
                  <div key={issue.id} className="relative flex-shrink-0 w-[240px]">
                    {/* Vertical line */}
                    <div className={`absolute left-1/2 w-0.5 bg-primary/30 -translate-x-1/2 ${isEven ? 'top-0 h-[240px]' : 'top-[288px] h-[140px]'}`} />

                    {/* Content */}
                    <Link
                      to={`/issues/${issueRouteId}`}
                      className={`flex flex-col group ${isEven ? 'items-center' : 'items-center flex-col-reverse'}`}
                    >
                      {/* Cover */}
                      <div className={isEven ? 'mb-8' : 'mt-8'}>
                        <div
                          className="w-[200px] aspect-[3/4] bg-white border border-border shadow-lg relative transition-transform duration-300 cursor-pointer hover:scale-105"
                        >
                          {coverImageUrl ? (
                            <img src={coverImageUrl} alt={issue.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs text-center px-3">
                              Cover unavailable
                            </div>
                          )}
                          <div className="absolute inset-0 bg-orange-600/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center px-3 gap-1">
                            <div className="text-white text-sm italic">{issue.title}</div>
                            <div className="text-white text-xs tracking-widest uppercase">View Issue</div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline dot */}
                      <div className="relative z-10 -my-2">
                        <div className="w-10 h-10 rounded-full border-4 bg-white border-primary shadow-lg flex items-center justify-center">
                          <div className="text-xs font-bold text-primary">
                            {isSpecialIssue(issue) ? 'S' : `#${String(issue.issueNumber)}`}
                          </div>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className={isEven ? 'mt-8' : 'mb-8'}>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary mb-1">{dateStr}</div>
                          <div className="text-xs uppercase tracking-widest text-muted-foreground">{issue.title}</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {loadingIssues && (
            <p className="text-center text-sm text-muted-foreground mt-4">Loading issues...</p>
          )}

          {!loadingIssues && issues.length === 0 && (
            <p className="text-center text-sm text-muted-foreground mt-4">No BSJ issues available yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
