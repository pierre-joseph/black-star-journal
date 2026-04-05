import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import PDFViewer from "@/components/PDFViewer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { FadeIn } from "@/components/FadeIn";
import { useParallax } from "@/hooks/useParallax";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Link } from "react-router-dom";

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
  coverImage: Media;
  fullPdf: Media;
  description?: string;
}

const ISSUES_DATA: Issue[] = [
  { id: '12', issueNumber: 12, title: 'Issue 12', slug: '12', publishDate: '2025-09-01', coverImage: { url: '/images/issue-covers/Issue-12.png' }, fullPdf: { url: '/pdfs/Issue-12.pdf.pdf' } },
  { id: '11', issueNumber: 11, title: 'Issue 11', slug: '11', publishDate: '2025-04-01', coverImage: { url: '/images/issue-covers/Issue-11.png' }, fullPdf: { url: '/pdfs/Issue-11.pdf.pdf' } },
  { id: '10', issueNumber: 10, title: 'Issue 10', slug: '10', publishDate: '2024-11-01', coverImage: { url: '/images/issue-covers/Issue-10.png' }, fullPdf: { url: '/pdfs/Issue-10.pdf.pdf' } },
  { id: '09', issueNumber: 9, title: 'Issue 09', slug: '09', publishDate: '2024-09-01', coverImage: { url: '/images/issue-covers/Issue-09.png' }, fullPdf: { url: '/pdfs/Issue-09.pdf.pdf' } },
  { id: '08', issueNumber: 8, title: 'Issue 08', slug: '08', publishDate: '2024-04-01', coverImage: { url: '/images/issue-covers/Issue-08.png' }, fullPdf: { url: '/pdfs/Issue-08.pdf.pdf' } },
  { id: '07', issueNumber: 7, title: 'Issue 07', slug: '07', publishDate: '2024-03-01', coverImage: { url: '/images/issue-covers/Issue-07.png' }, fullPdf: { url: '/pdfs/Issue-07.pdf.pdf' } },
  { id: '06', issueNumber: 6, title: 'Issue 06', slug: '06', publishDate: '2024-02-01', coverImage: { url: '/images/issue-covers/Issue-06.png' }, fullPdf: { url: '/pdfs/Issue-06.pdf.pdf' } },
  { id: '05', issueNumber: 5, title: 'Issue 05', slug: '05', publishDate: '2024-01-01', coverImage: { url: '/images/issue-covers/Issue-05.png' }, fullPdf: { url: '/pdfs/Issue-05.pdf.pdf' } },
  { id: '04', issueNumber: 4, title: 'Issue 04', slug: '04', publishDate: '2023-11-01', coverImage: { url: '/images/issue-covers/Issue-04.png' }, fullPdf: { url: '/pdfs/Issue-04.pdf.pdf' } },
  { id: '03', issueNumber: 3, title: 'Issue 03', slug: '03', publishDate: '2023-04-01', coverImage: { url: '/images/issue-covers/Issue-03.png' }, fullPdf: { url: '/pdfs/Issue-03.pdf.pdf' } },
  { id: '02', issueNumber: 2, title: 'Issue 02', slug: '02', publishDate: '2022-10-01', coverImage: { url: '/images/issue-covers/Issue-02.png' }, fullPdf: { url: '/pdfs/Issue-02.pdf.pdf' } },
  { id: '01', issueNumber: 1, title: 'Issue 01', slug: '01', publishDate: '2022-02-01', coverImage: { url: '/images/issue-covers/Issue-01.png' }, fullPdf: { url: '/pdfs/Issue-01.pdf.pdf' } },
];

export default function Home() {
  usePageTitle();
  const [videoReady, setVideoReady] = useState(false);
  const parallaxOffset = useParallax(0.3);
  const { recent } = useRecentlyViewed();

  useEffect(() => {
    const timer = setTimeout(() => setVideoReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);
  const [showPDF, setShowPDF] = useState(false);
  const issues = ISSUES_DATA;

  const latestIssue = issues[0];
  const latestIssueCoverUrl = latestIssue?.coverImage?.url;
  const latestIssuePdfUrl = latestIssue?.fullPdf?.url;

  return (
    <div className="flex flex-col gap-12 pb-20 pt-10">
      {/* Hero Section with YouTube Video Background */}
      <section className="relative overflow-hidden">
        {/* YouTube Video Background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        >
          {/* Black cover to hide YT branding during load */}
          <div
            className="absolute inset-0 z-10 bg-black transition-opacity duration-700"
            style={{ opacity: videoReady ? 0 : 1, pointerEvents: 'none' }}
          />
          <iframe
            src="https://www.youtube-nocookie.com/embed/JS-FsGwGMYw?autoplay=1&mute=1&loop=1&playlist=JS-FsGwGMYw&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&start=0&vq=hd1080"
            title="Brown University Background Video"
            className="absolute top-1/2 left-1/2"
            style={{
              border: 'none',
              width: 'max(100%, 177.78vh)',
              height: 'max(100%, 56.25vw)',
              transform: 'translate(-50%, -50%)',
            }}
            allow="autoplay; encrypted-media"
            tabIndex={-1}
          />
        </div>

        {/* Decorative Stars */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {/* Large star — top right */}
          <svg className="absolute top-8 right-[12%] w-14 h-14 text-[#f97316] opacity-90 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
          </svg>
          {/* Medium star — left side near title */}
          <svg className="absolute top-[30%] left-[8%] w-8 h-8 text-white opacity-70" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
          </svg>
          {/* Small star — bottom left */}
          <svg className="absolute bottom-[15%] left-[18%] w-5 h-5 text-[#f97316] opacity-60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
          </svg>
          {/* Tiny star — top left */}
          <svg className="absolute top-[15%] left-[25%] w-4 h-4 text-white opacity-50" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
          </svg>
          {/* Medium star — right side mid */}
          <svg className="absolute top-[55%] right-[5%] w-7 h-7 text-[#f97316] opacity-75 animate-pulse" style={{ animationDelay: '1s' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
          </svg>
          {/* Small star — center top */}
          <svg className="absolute top-[10%] left-[50%] w-5 h-5 text-white opacity-40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
          </svg>
          {/* Tiny star — bottom right */}
          <svg className="absolute bottom-[25%] right-[22%] w-3 h-3 text-white opacity-55" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-32 md:py-24">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Text */}
            <div className="md:col-span-5 flex flex-col justify-center h-full pt-20">
              <h1
                className="font-sans font-black text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-white mb-6"
                style={{ WebkitTextStroke: '2px black', paintOrder: 'stroke fill', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
              >
                THE<br />
                BLACK<br />
                STAR<br />
                JOURNAL
              </h1>
              
              <div className="mt-auto">
                <p
                  className="font-serif text-lg leading-relaxed text-white max-w-md bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-black/80"
                >
                  Amplifying Black voices. Celebrating Black excellence. Building community at Brown.
                </p>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="md:col-span-7">
              <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-black">
                <img 
                  src="/images/pink_room.png"
                  alt="Image of Pink Room" 
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
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
              "The BSJ is a source of Black news, life, existence, and culture where Black voices on Brown's campus build community."
            </p>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              Founded in 2021, we are more than a publication—we are a safe space and platform dedicated to documenting the Black experience at Brown University. Through journalism, storytelling, and creative expression, we hold space for joy, resilience, struggle, and triumph.
            </p>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              Every piece we publish is an act of reclamation and representation, building an archive of our own stories, told with the authenticity and care they deserve.
            </p>
          </div>
          </FadeIn>
          <FadeIn direction="right" delay={200}>
          <div className="relative aspect-square md:aspect-video rounded-xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/images/issue-covers/Issue-06.png" 
              alt="BSJ Issue 6 Cover Image" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured Issue Section */}
      <section className="bg-muted/30 py-20 border-y border-border">
        <div className="container mx-auto px-4">
          <FadeIn direction="up">
          <div className="text-center mb-12">
            <span className="text-sm font-bold tracking-widest uppercase text-primary mb-2 block">Current Edition</span>
            <h2 className="font-heading font-black text-4xl md:text-5xl">BSJ ISSUE #{issues[0]?.issueNumber}</h2>
          </div>
          </FadeIn>
          
          {!showPDF ? (
            <FadeIn direction="up" delay={150}>
            <div className="flex flex-col items-center gap-6 mb-12">
              <img src={latestIssueCoverUrl} alt="Cover of the current issue" className="h-[800px] object-cover shadow-2xl" loading="lazy" />
              <Button 
                onClick={() => setShowPDF(true)}
                disabled={!latestIssuePdfUrl}
                className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-8 py-6 text-lg"
              >
                Open & Read
              </Button>
            </div>
            </FadeIn>
          ) : (
            <div className="max-w-7xl mx-auto">
              {latestIssuePdfUrl && (
                <PDFViewer 
                  pdfUrl={latestIssuePdfUrl} 
                  initialPage={1}
                  onClose={() => setShowPDF(false)} 
                />
              )}
              <div className="text-center mt-6">
                <Button 
                  onClick={() => setShowPDF(false)}
                  variant="outline"
                  className="font-semibold"
                >
                  Close Reader
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recently Viewed */}
      {recent.length > 0 && (
        <section className="container mx-auto px-4">
          <FadeIn direction="up">
            <h2 className="font-heading font-bold text-xl text-foreground mb-4 tracking-wide uppercase">Recently Viewed</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {recent.map((r) => (
                <Link key={r.id} to={`/issue/${r.id}`} className="flex-shrink-0 group">
                  <div className="w-28 h-40 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                    <img src={r.cover} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 text-center w-28 truncate">{r.title}</p>
                  <p className="text-[10px] text-muted-foreground/60 text-center w-28">
                    {new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}{' '}
                    {new Date(r.timestamp).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </Link>
              ))}
            </div>
          </FadeIn>
        </section>
      )}

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
