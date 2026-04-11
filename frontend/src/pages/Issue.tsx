import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PDFViewer from "@/components/PDFViewer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { FadeIn } from "@/components/FadeIn";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
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

const ISSUE_COLORS = [
  '#e74c3c',
  '#3498db',
  '#2ecc71',
  '#f39c12',
  '#9b59b6',
  '#1abc9c',
  '#e67e22',
  '#34495e',
  '#c0392b',
  '#16a085',
  '#8e44ad',
  '#2980b9',
];

const isSpecialIssue = (issue: Issue): boolean =>
  issue.issueNumber <= 0 ||
  (issue.slug || '').toLowerCase().includes('special') ||
  (issue.title || '').toLowerCase().includes('special');

const sortIssuesForDisplay = (items: Issue[]): Issue[] => {
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
    return 'special';
  }

  return String(issue.issueNumber).padStart(2, '0');
};

const getIssueDisplayLabel = (issue: Issue): string => {
  if (isSpecialIssue(issue)) {
    return 'Special';
  }

  return `#${String(issue.issueNumber).padStart(2, '0')}`;
};

const getIssueColor = (issue: Issue): string => {
  if (isSpecialIssue(issue)) {
    return '#f1c40f';
  }

  const index = Math.max(issue.issueNumber - 1, 0) % ISSUE_COLORS.length;
  return ISSUE_COLORS[index];
};

const getPublishedParts = (publishDate: string): { month: string; year: string } => {
  const parsed = new Date(publishDate);

  if (Number.isNaN(parsed.getTime())) {
    return { month: 'Unknown', year: 'Unknown' };
  }

  return {
    month: parsed.toLocaleDateString('en-US', { month: 'long' }),
    year: String(parsed.getFullYear()),
  };
};

export default function IssuePage() {
  const { id } = useParams();
  const routeId = (id || '').trim().toLowerCase();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [showPDF, setShowPDF] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const { addViewed } = useRecentlyViewed();

  useEffect(() => {
    let mounted = true;

    const loadIssues = async () => {
      setLoadingIssues(true);

      try {
        const response = await fetch(backendApiUrl('/api/bsjissues?sort=issueNumber&limit=200&depth=1'));

        if (!response.ok) {
          throw new Error(`Failed to fetch issues: ${response.status}`);
        }

        const data = await response.json();
        const docs = Array.isArray(data?.docs) ? (data.docs as Issue[]) : [];

        if (!mounted) return;
        setIssues(sortIssuesForDisplay(docs));
      } catch (error) {
        if (mounted) {
          console.error('Error loading issue data:', error);
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

  useEffect(() => {
    setShowPDF(false);
  }, [routeId]);

  const issue = useMemo(() => {
    if (!routeId) return undefined;

    return issues.find((candidate) => {
      const slugMatch = candidate.slug?.toLowerCase() === routeId;
      const idMatch = candidate.id?.toLowerCase() === routeId;
      const numberRaw = String(candidate.issueNumber);
      const numberPadded = candidate.issueNumber > 0 ? String(candidate.issueNumber).padStart(2, '0') : numberRaw;
      const numberMatch = routeId === numberRaw || routeId === numberPadded;
      const specialMatch = isSpecialIssue(candidate) && routeId === 'special';

      return slugMatch || idMatch || numberMatch || specialMatch;
    });
  }, [issues, routeId]);

  const issueCoverUrl =
    resolveR2AssetUrl(issue?.coverArtwork) ??
    resolveR2AssetUrl(issue?.coverImage);
  const issuePdfUrl = resolveR2AssetUrl(issue?.fullPdf);
  const published = issue ? getPublishedParts(issue.publishDate) : { month: 'Unknown', year: 'Unknown' };
  const issueRouteId = issue ? getIssueRouteId(issue) : routeId;
  const issueLabel = issue ? getIssueDisplayLabel(issue) : '';

  usePageTitle(issue?.title ?? (loadingIssues ? 'Loading Issue...' : 'Issue Not Found'));

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: issue?.title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loadingIssues) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold">Loading issue...</h1>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link to="/issues" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft size={20} />
          Back to Issues
        </Link>
        <h1 className="text-3xl font-bold">Issue not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Issues', href: '/issues' },
        { label: issue.title },
      ]} />

      <Link to="/issues" className="flex items-center gap-2 text-primary hover:text-primary/80 mt-4 mb-8">
        <ArrowLeft size={20} />
        Back to Issues
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* Issue Header */}
        <FadeIn direction="up">
        <div className="mb-12 pb-8 border-b border-border">
          <Badge
            className="mb-4"
            style={{
              backgroundColor: getIssueColor(issue),
              color: isSpecialIssue(issue) ? '#111827' : '#ffffff',
            }}
          >
            {published.month} {published.year}
          </Badge>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-heading font-black text-5xl mb-2">{issue.title}</h1>
              <p className="text-lg text-muted-foreground">
                {isSpecialIssue(issue)
                  ? 'A special edition of Black Star Journal'
                  : `Published in ${published.month} ${published.year}`}
              </p>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium shrink-0"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
        </FadeIn>

        {/* PDF Viewer */}
        <div className="mb-12">
          {!showPDF ? (
            <div className="flex flex-col items-center gap-6 py-8">
              {issueCoverUrl ? (
                <img
                  src={issueCoverUrl}
                  alt={`${issue.title} Cover`}
                  className="max-h-[600px] w-auto object-contain rounded-lg shadow-2xl hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full max-w-[420px] aspect-[3/4] bg-muted border border-border rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                  Cover unavailable
                </div>
              )}
              <button
                onClick={() => {
                  if (!issuePdfUrl) return;
                  setShowPDF(true);
                  if (issueCoverUrl) {
                    addViewed(issueRouteId, issue.title, issueCoverUrl);
                  }
                }}
                disabled={!issuePdfUrl}
                className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-8 py-4 text-lg rounded-lg transition-colors"
              >
                Open & Read Issue
              </button>
            </div>
          ) : (
            issuePdfUrl ? (
              <PDFViewer
                pdfUrl={issuePdfUrl}
                onClose={() => setShowPDF(false)}
                initialPage={1}
              />
            ) : (
              <div className="h-[480px] bg-muted rounded-lg border border-border flex items-center justify-center text-muted-foreground text-sm">
                PDF unavailable for this issue.
              </div>
            )
          )}
        </div>

        {/* Issue Details */}
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-widest mb-2 text-muted-foreground">
              Issue Number
            </h3>
            <p className="text-2xl font-bold">{issueLabel}</p>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-widest mb-2 text-muted-foreground">
              Publication Date
            </h3>
            <p className="text-2xl font-bold">{published.month}</p>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-widest mb-2 text-muted-foreground">
              Year
            </h3>
            <p className="text-2xl font-bold">{published.year}</p>
          </div>
        </div>

        {/* Other Issues Timeline */}
        <div className="mt-12 pt-12 border-t border-border">
          <h2 className="font-heading font-bold text-2xl mb-8 uppercase tracking-wider">All Issues</h2>
          <div className="overflow-x-auto pb-4">
            <div className="relative inline-flex gap-6 px-4 min-w-full">
              {/* Horizontal spine */}
              <div className="absolute top-[90px] left-0 right-0 h-0.5 bg-border" />

              {issues.map((item) => {
                const itemRouteId = getIssueRouteId(item);
                const isCurrent = item.id === issue.id;
                const timelineCoverUrl =
                  resolveR2AssetUrl(item.coverArtwork) ??
                  resolveR2AssetUrl(item.coverImage);
                const timelineLabel = getIssueDisplayLabel(item);

                return (
                  <Link
                    key={item.id}
                    to={`/issues/${itemRouteId}`}
                    className={`relative flex-shrink-0 flex flex-col items-center group ${isCurrent ? 'pointer-events-none' : ''}`}
                  >
                    {/* Cover thumbnail */}
                    <div className={`w-[100px] h-[130px] rounded overflow-hidden shadow-md transition-all duration-300 ${
                      isCurrent ? 'ring-2 ring-[#f97316] scale-105' : 'group-hover:scale-110 group-hover:shadow-xl'
                    }`}>
                      {timelineCoverUrl ? (
                        <img
                          src={timelineCoverUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground text-center px-1">
                          No cover
                        </div>
                      )}
                    </div>

                    {/* Timeline dot */}
                    <div className={`mt-3 w-3 h-3 rounded-full border-2 ${
                      isCurrent ? 'bg-[#f97316] border-[#f97316]' : 'bg-white border-stone-400 group-hover:border-[#f97316]'
                    }`} />

                    {/* Label */}
                    <div className={`mt-2 text-center text-xs font-medium ${
                      isCurrent ? 'text-[#f97316] font-bold' : 'text-muted-foreground group-hover:text-foreground'
                    }`}>
                      {timelineLabel}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {issues.length === 0 && (
            <p className="text-sm text-muted-foreground mt-4">No issues available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
