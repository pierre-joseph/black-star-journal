import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { FadeIn } from "@/components/FadeIn";
import { backendApiUrl, resolveR2AssetUrl } from "@/lib/api";

interface Media {
  url: string;
  filename?: string;
  alt?: string;
  page?: number;
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

const getIssueRouteId = (issue?: Issue): string | null => {
  if (!issue) {
    return null;
  }

  const slug = issue.slug?.trim();
  if (slug) {
    return slug;
  }

  if (issue.issueNumber <= 0) {
    return "special";
  }

  return String(issue.issueNumber).padStart(2, "0");
};

export default function Home() {
  usePageTitle();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [heroMedia, setHeroMedia] = useState<Media | null>(null);
  const [homeBackgroundUrl, setHomeBackgroundUrl] = useState<string | null>(null);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [showNewPopup, setShowNewPopup] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const loadHomepageData = async () => {
      setLoadingIssues(true);

      try {
        const [issuesResponse, heroMediaResponse, homeBackgroundResponse] = await Promise.all([
          fetch(backendApiUrl("/api/bsjissues?sort=-issueNumber&limit=12&depth=1")),
          fetch(backendApiUrl("/api/media?where[alt][equals]=BSJ8CoverImage&limit=1")),
          fetch(backendApiUrl("/api/media?where[alt][equals]=homebg&limit=1&depth=0")),
        ]);

        if (!issuesResponse.ok) {
          throw new Error(`Failed to fetch issues: ${issuesResponse.status}`);
        }

        const issuesData = await issuesResponse.json();
        const heroData = heroMediaResponse.ok ? await heroMediaResponse.json() : { docs: [] };
        const homeBackgroundData = homeBackgroundResponse.ok
          ? await homeBackgroundResponse.json()
          : { docs: [] };

        if (!mounted) return;

        const docs = Array.isArray(issuesData?.docs) ? (issuesData.docs as Issue[]) : [];
        const sortedIssues = [...docs].sort((a, b) => b.issueNumber - a.issueNumber);

        const homeBackgroundDoc = Array.isArray(homeBackgroundData?.docs)
          ? (homeBackgroundData.docs[0] as Media | undefined)
          : undefined;

        const resolvedHomeBackgroundUrl = homeBackgroundDoc
          ? resolveR2AssetUrl(homeBackgroundDoc)
          : undefined;

        const nextHomeBackgroundUrl = resolvedHomeBackgroundUrl
          ? resolvedHomeBackgroundUrl
          : homeBackgroundDoc?.url
            ? homeBackgroundDoc.url.startsWith("http")
              ? homeBackgroundDoc.url
              : backendApiUrl(homeBackgroundDoc.url)
            : null;

        setIssues(sortedIssues);
        setHeroMedia(Array.isArray(heroData?.docs) ? (heroData.docs[0] ?? null) : null);
        setHomeBackgroundUrl(nextHomeBackgroundUrl);
      } catch (error) {
        if (mounted) {
          console.error("Failed to load homepage CMS data", error);
          setIssues([]);
          setHeroMedia(null);
          setHomeBackgroundUrl(null);
        }
      } finally {
        if (mounted) {
          setLoadingIssues(false);
        }
      }
    };

    loadHomepageData();

    return () => {
      mounted = false;
    };
  }, []);

  const latestIssue = issues[0];
  const latestIssueCoverUrl =
    resolveR2AssetUrl(latestIssue?.coverArtwork) ??
    resolveR2AssetUrl(latestIssue?.coverImage);
  const latestIssueRouteId = getIssueRouteId(latestIssue);
  const latestIssuePath = latestIssueRouteId ? `/issues/${latestIssueRouteId}` : "/issues";
  const heroCoverUrl = resolveR2AssetUrl(heroMedia) ?? latestIssueCoverUrl;

  // show "new issue" badge/popup when there's a latest issue the user hasn't seen
  useEffect(() => {
    if (!latestIssue) return;
    const key = `bsj_seen_issue_${latestIssue.id}`;
    const seen = localStorage.getItem(key) === '1';
    if (!seen) {
      setShowNewPopup(true);
    }
  }, [latestIssue]);

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section with CMS image background */}
      <section className="relative overflow-hidden h-[90vh] min-h-[600px]">

  {/* Background */}
  <div className="absolute inset-0 z-0">
    {homeBackgroundUrl ? (
      <img
        src={homeBackgroundUrl}
        alt="Providence Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
    ) : (
      <div className="absolute inset-0 bg-[#1a1a1a]" />
    )}
    {/* Dark gradient overlay for legibility */}
    <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
  </div>

  {/* Hero Content */}
  <div className="relative z-30 h-full flex flex-col justify-end pb-16 md:pb-20">
    <div className="container mx-auto px-6 md:px-10">
      {showNewPopup && latestIssue && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="absolute right-6 top-6 z-40 w-[min(90vw,22rem)] rounded-2xl border border-white/15 bg-black/75 p-4 text-white shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-[#f97316] shadow-[0_0_0_8px_rgba(249,115,22,0.15)]" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black tracking-[0.28em] uppercase text-[#f97316]">New issue</p>
              <h2 className="mt-1 text-lg font-black leading-tight">{latestIssue.title}</h2>
              <p className="mt-1 text-sm text-white/75">The latest issue is live now. Read it below.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={latestIssuePath}
                  onClick={() => {
                    if (latestIssue) {
                      localStorage.setItem(`bsj_seen_issue_${latestIssue.id}`, '1');
                      setShowNewPopup(false);
                    }
                  }}
                  className="inline-flex items-center rounded-full bg-[#f97316] px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#ea580c]"
                >
                  Open issue
                </a>
                <button
                  type="button"
                  onClick={() => {
                    if (latestIssue) {
                      localStorage.setItem(`bsj_seen_issue_${latestIssue.id}`, '1');
                    }
                    setShowNewPopup(false);
                  }}
                  className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80 transition-colors hover:border-white/40 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Eyebrow */}
      <p className="font-sans text-[11px] font-bold tracking-[0.28em] uppercase text-[#f97316] mb-4">
        Brown University & RISD · Est. 2021
      </p>

      {/* Title */}
      <h1
        style={{
          fontFamily: 'Impact, "Arial Narrow", sans-serif',
          fontSize: 'clamp(56px, 10vw, 130px)',
          lineHeight: 0.88,
          letterSpacing: '-0.01em',
          fontWeight: 900,
          textTransform: 'uppercase',
          color: '#fff',
        }}
      >
        The Black<br />Star Journal
      </h1>

      {/* Divider */}
      <div className="w-12 h-0.5 bg-[#f97316] my-6" />

      {/* Tagline + CTA row */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-6">
        <p className="font-serif text-lg leading-relaxed text-white/80 italic max-w-sm">
          Amplifying Black voices.<br />Celebrating Black excellence.<br />Building community at Brown and RISD.
        </p>
        <div className="flex gap-3 sm:self-center">
          {latestIssue ? (
            <a
              href={latestIssuePath}
              className="bg-[#f97316] text-black font-sans text-[10px] font-black tracking-[0.18em] uppercase px-5 py-2.5 hover:bg-[#ea580c] transition-colors"
            >
              Read Current Issue
                <span className="sr-only">New issue available</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="bg-[#f97316] text-black font-sans text-[10px] font-black tracking-[0.18em] uppercase px-5 py-2.5 opacity-60 cursor-not-allowed"
            >
              Read Current Issue
            </button>
          )}
          <a
            href="/issues"
            className="border border-white/30 text-white font-sans text-[10px] tracking-[0.18em] uppercase px-5 py-2.5 hover:border-white hover:text-white transition-colors"
          >
            All Issues
          </a>
        </div>
      </div>

    </div>
  </div>

</section>

      {/* Mission Section */}
      <section id="mission" className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold tracking-wider text-[#f97316] uppercase">
                Established 2021
              </p>
              <h2 className="font-heading font-bold text-4xl tracking-tight">Our Mission</h2>
              <div className="w-24 h-1 bg-primary" />
            </div>
            <p className="font-serif text-xl italic leading-relaxed">
              "The BSJ is a source of Black news, life, existence, and culture where Black voices on Brown's and RISD's campus communities."
            </p>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              Founded in 2021, we are more than a publication—we are a safe space and platform dedicated to documenting the Black experience at Brown University and RISD. Through journalism, storytelling, and creative expression, we hold space for joy, resilience, struggle, and triumph.
            </p>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              Every piece we publish is an act of reclamation and representation, building an archive of our own stories, told with the authenticity and care they deserve.
            </p>
          </div>
          </FadeIn>
          <FadeIn direction="right" delay={200}>
          <div className="relative aspect-square md:aspect-video rounded-xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            {heroCoverUrl ? (
              <img
                src={heroCoverUrl}
                alt={heroMedia?.alt || "Black Star Journal feature image"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                {loadingIssues ? "Loading image..." : "Feature image unavailable"}
              </div>
            )}
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          </div>
          </FadeIn>
        </div>
      </section>

      {/* Founder Story */}
      <section className="container mx-auto px-4">
        <FadeIn direction="up">
          <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#f97316] mb-3">
              How It Started
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl mb-4 leading-tight">
              Founded to fill the record.
            </h2>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              The Black Star Journal was founded in 2021 by Amiri Nash '24 and Keiley
              Thompson '24 - two Brown sophomores who noticed something missing. After
              searching campus archives for evidence of Black student life and finding
              almost none, Nash reached out to Thompson with a simple idea: build the
              publication that should have always existed. What started as a conversation
              became Brown's first newspaper dedicated entirely to the Black experience.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="https://www.brownalumnimagazine.com/articles/2022-06-09/a-star-is-born"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-sans text-xs font-bold tracking-[0.15em] uppercase text-[#f97316] hover:underline"
              >
                Brown Alumni Magazine story →
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Get Involved CTA */}
      <section className="container mx-auto px-4">
        <FadeIn direction="up">
          <div className="bg-[#f97316] rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="font-heading font-black text-3xl md:text-4xl mb-3">Get Involved</h2>
            <p className="font-serif text-lg text-white/90 max-w-xl mx-auto mb-6">
              Have a story to tell? Want to contribute art, photography, or poetry? BSJ is always looking for new voices.
            </p>
            <a
              href="https://www.instagram.com/theblackstarjournal/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#f97316] font-bold px-8 py-3 rounded-full hover:bg-white/90 transition-colors text-sm tracking-wide uppercase"
            >
              Reach Out on Instagram
            </a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
