import { useEffect, useState } from "react";
import { BookOpen, Calendar } from "lucide-react";
import PDFViewer from "@/components/PDFViewer";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import { backendApiUrl, resolveR2AssetUrl } from "@/lib/api";

// ─── Publication Profiles ──────────────────────────────────────────────────────

const PUBLICATIONS_INFO = [
  {
    id: "african-sun",
    name: "African Sun",
    subtitle: "Monthly Black Cultural Publication · Organization of United African People (now BSU)",
    years: "1991 – 2010",
    color: "#b45309",
    description:
      "African Sun was the monthly Black cultural publication of the Organization of United African People — now the Black Student Union — at Brown University. Running from 1991 to 2010, it gave African and African-diasporic students a platform to express their cultures, share their stories, and build solidarity on campus. Known for its bold cover art, personal essays, poetry, and cultural commentary, it became one of the most visually striking student publications in Brown's history. The University Archives holds volumes from 1991 to 2010.",
    legacy:
      "African Sun set the standard for what Black publication design could look like at Brown. Its covers became campus landmarks — passed around in dorms, hung on walls, photographed and shared. Spanning nearly two decades, it documented the full arc of a generation of Black student life on College Hill.",
    knownFor: ["Cover art", "Poetry", "Personal essays", "Cultural commentary"],
    status: "archived" as const,
  },
  {
    id: "bop",
    name: "BOP",
    subtitle: "Blacks on Paper · 1972 - 1975",
    years: "1972 – 1975",
    color: "#1c1917",
    description:
      "Blacks on Paper (BOP) was a literary magazine published by Black students at Brown from 1972 to 1975. The magazine expressed students' individual experiences and visions and encompassed, in the editors' own words, \"a whole spectrum of black thought.\" Fiction, poetry, political essays, and personal narratives filled its pages — creating a room of one's own for Black students outside of predominantly white academic publishing. Editors included Rodney Dennis, Kambon Obayani, and Gayl Jones. The University Archives holds volumes from 1974 and 1975.",
    legacy:
      "BOP was one of the earliest dedicated Black student literary publications at Brown — predating most of what came after by decades. Its editors went on to distinguished careers in literature and scholarship. Gayl Jones, one of BOP's editors, became celebrated as one of the most important Black novelists of the twentieth century. BOP's archives are a primary source for understanding Black intellectual life at Brown in the early 1970s.",
    knownFor: ["Fiction", "Poetry", "Political essays", "Personal narratives"],
    status: "archived" as const,
  },
  {
    id: "uwezo",
    name: "Uwezo",
    subtitle: "Official Publication of the Organization of United African People (now BSU)",
    years: "1970 – 1993",
    color: "#14532d",
    description:
      "Uwezo was the official publication of the Organization of United African People — now the Black Student Union — at Brown University. Its title comes from the Swahili word for \"unity and strength.\" Running from 1970 to 1993, Uwezo was one of the longest-running Black student publications in Brown's history, and one of the earliest — predating most campus Black press by years. It encompassed political thought, cultural expression, and community organizing across more than two decades of student activism. The University Archives holds volumes from 1970 to 1993.",
    legacy:
      "Uwezo's twenty-three year run makes it one of the most sustained Black student publications in Ivy League history. It documented Brown's Black community through the Black Power era, the Third World Center's founding, Reagan-era campus politics, and into the early 1990s. Its archives are an irreplaceable record — and the blueprint for everything that came after it, including African Sun and BSJ.",
    knownFor: ["Political thought", "Community organizing", "Cultural expression", "23-year run"],
    status: "archived" as const,
  },
];

interface Media {
  filename?: string;
  url?: string;
  alt?: string;
}

interface AfricanSunIssue {
  id: string;
  title: string;
  publishDate: string;
  coverImage?: Media | string | null;
  fullPdf?: Media | string;
  description?: string;
}

// ─── BSJ Connection ──────────────────────────────────────────────────────────────────
const BSJ_CONNECTION_POINTS = [
  { label: "Blacks on Paper (BOP)", connector: "gave us the form", detail: "The personal essay tradition BOP built from 1972 — honest, unfiltered, written for a Black audience — lives in every BSJ piece." },
  { label: "Uwezo", connector: "gave us the foundation", detail: "Uwezo's 23-year run as the official OUAP publication established that a Black student press at Brown was not optional. BSJ is the continuation of that institutional commitment." },
  { label: "African Sun", connector: "gave us the vision", detail: "African Sun proved that a Black student publication could be as beautiful as it is powerful. Monthly, sustained, designed with intention. We carry that standard." },
];

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function Archives() {
  usePageTitle('Archives');
  const [africanSunIssues, setAfricanSunIssues] = useState<AfricanSunIssue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<AfricanSunIssue | null>(null);
  const [magazineCovers, setMagazineCovers] = useState<Media[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(true);

  const getPdfUrl = (issue?: AfricanSunIssue | null): string | undefined => {
    if (!issue?.fullPdf) return undefined;
    return resolveR2AssetUrl(issue.fullPdf);
  };

  const getCoverImageUrl = (issue?: AfricanSunIssue | null): string | undefined => {
    if (!issue?.coverImage) return undefined;
    return resolveR2AssetUrl(issue.coverImage);
  };

  useEffect(() => {
    let mounted = true;

    const loadArchiveData = async () => {
      setLoadingIssues(true);

      try {
        const [issuesResponse, coversResponse] = await Promise.all([
          fetch(backendApiUrl("/api/africansun?sort=-publishDate&limit=200&depth=2")),
          fetch(backendApiUrl("/api/media?where[alt][equals]=AfricanSunMagazineCovers&limit=1")),
        ]);

        if (!issuesResponse.ok) {
          throw new Error(`Failed to fetch African Sun issues: ${issuesResponse.status}`);
        }

        const issuesData = await issuesResponse.json();
        const coversData = coversResponse.ok ? await coversResponse.json() : { docs: [] };

        if (!mounted) return;

        const docs = Array.isArray(issuesData?.docs) ? (issuesData.docs as AfricanSunIssue[]) : [];
        const sortedIssues = [...docs].sort(
          (a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
        );

        setAfricanSunIssues(sortedIssues);
        setMagazineCovers(Array.isArray(coversData?.docs) ? (coversData.docs as Media[]) : []);
      } catch (error) {
        if (mounted) {
          console.error("Error fetching archive data:", error);
          setAfricanSunIssues([]);
          setMagazineCovers([]);
        }
      } finally {
        if (mounted) {
          setLoadingIssues(false);
        }
      }
    };

    loadArchiveData();

    return () => {
      mounted = false;
    };
  }, []);

  const firstArchiveIssue = africanSunIssues[0];
  const featuredArchiveCover = resolveR2AssetUrl(magazineCovers[0]) ?? getCoverImageUrl(firstArchiveIssue);
  const featuredArchiveAlt = magazineCovers[0]?.alt || firstArchiveIssue?.title || "African Sun cover";
    
  useEffect(() => {
    if (!selectedIssue) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIssue(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIssue]);

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-[#f97316] py-24 text-center">
        <div className="container mx-auto px-4">
          <p className="text-white/70 text-sm font-bold tracking-widest uppercase mb-4">
            Brown University · Black Publication History
          </p>
          <h1 className="font-heading font-black text-5xl md:text-8xl mb-6 text-white leading-tight">
            THE ARCHIVE
          </h1>
          <div className="w-24 h-1 bg-white/40 mx-auto mb-6" />
          <p className="font-serif text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            A tribute to the Black publications that came before us — and the students who built them.
          </p>
          <p className="text-white/50 text-xs tracking-widest uppercase mt-4">
            African Sun · BOP · Uwezo · and more
          </p>
        </div>
      </section>

      {/* ── MISSION / THROUGHLINE ────────────────────────────────── */}
      <section className="py-20 bg-muted/20 border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#f97316] flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#f97316]">Before BSJ, there was a tradition</span>
          </div>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground mb-6 leading-tight">
            Black voices built this<br /> ground before we arrived.
          </h2>
          <div className="w-16 h-1 bg-[#f97316] mb-8" />
          <p className="font-serif text-xl text-muted-foreground leading-relaxed mb-6">
            The Black Star Journal did not emerge from nothing. It was born into a tradition — a decades-long lineage of Black student publications at Brown that created space, documented truth, and shaped what it meant to have a Black intellectual community on this campus.
          </p>
          <p className="font-serif text-xl text-muted-foreground leading-relaxed mb-6">
            <em>African Sun</em>, <em>BOP (Black on Paper)</em>, and <em>Uwezo</em> each carved out their own era. Their editors wrote under pressure. Their contributors showed up when resources were scarce. Their issues were passed hand to hand in dining halls and dormitories.
          </p>
          <p className="font-serif text-xl text-muted-foreground leading-relaxed">
            This page is their archive. Their record. Their due.
          </p>
        </div>
      </section>

      {/* ── PUBLICATION PROFILES ─────────────────────────────────── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <span className="text-xs font-bold tracking-widest uppercase text-[#f97316] mb-2 block">The publications</span>
          <h2 className="font-heading font-black text-3xl text-foreground mb-12">Who They Were</h2>
          <div className="flex flex-col gap-16">
            {PUBLICATIONS_INFO.map((pub, i) => (
              <div key={pub.name} className={`grid md:grid-cols-2 gap-10 items-start ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="inline-block px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-widest uppercase mb-4"
                    style={{ background: pub.color }}>
                    Legacy Publication
                  </div>
                  <h3 className="font-heading font-black text-3xl text-foreground mb-2">{pub.name}</h3>
                  <div className="text-xs text-muted-foreground tracking-widest uppercase mb-4">{pub.years}</div>
                  <div className="w-10 h-1 mb-6" style={{ background: pub.color }} />
                  <p className="font-serif text-muted-foreground leading-relaxed mb-4">{pub.description}</p>
                  <p className="font-serif text-muted-foreground text-sm leading-relaxed italic mb-6">{pub.legacy}</p>
                  <div className="flex flex-wrap gap-2">
                    {pub.knownFor.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className={`flex items-center justify-center ${i % 2 === 1 ? "md:order-1" : ""}`}>
                  {pub.id === "african-sun" && featuredArchiveCover ? (
                    <div className="w-56 h-72 rounded-lg shadow-2xl overflow-hidden relative">
                      <img
                        src={featuredArchiveCover}
                        alt={featuredArchiveAlt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="text-[9px] font-bold tracking-widest uppercase text-white/70 mb-1">Brown University</div>
                        <div className="font-heading font-black text-xl leading-tight">{pub.name}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-56 h-72 rounded-lg shadow-2xl flex flex-col justify-between p-8 relative overflow-hidden"
                      style={{ background: pub.color }}>
                      <div>
                        <div className="text-[9px] font-bold tracking-widest uppercase text-white/40 mb-2">Brown University</div>
                        <div className="text-white font-heading font-black text-2xl leading-tight">{pub.name}</div>
                      </div>
                      <div>
                        <div className="w-10 h-0.5 bg-white/30 mb-3" />
                        <div className="text-white/50 text-xs tracking-wider">{pub.years}</div>
                      </div>
                      <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ISSUE BROWSER ─────────────────────────────────────────── */}
      <section className="py-20 bg-muted/20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={18} className="text-[#f97316]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#f97316]">African Sun timeline</span>
          </div>
          <h2 className="font-heading font-black text-3xl text-foreground mb-6">African Sun Issues</h2>

          {/* Horizontal alternating timeline */}
          <div className="relative">
              <div className="overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
              <div className="relative inline-flex gap-12 px-8 min-w-full">

                {/* Horizontal spine */}
                <div className="absolute top-[220px] left-0 right-0 h-0.5 bg-border" />

                {africanSunIssues.map((issue, index) => {
                  const isEven = index % 2 === 0;
                  const issueDate = new Date(issue.publishDate);
                  const formattedDate = issueDate.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  });
                  const year = issueDate.getFullYear();
                  const canOpenPdf = Boolean(getPdfUrl(issue));
                  const coverImageUrl = getCoverImageUrl(issue);
                  return (
                    <div key={issue.id} className="relative flex-shrink-0 w-[220px]">

                      {/* Vertical connector */}
                      <div
                        className={`absolute left-1/2 w-0.5 bg-border -translate-x-1/2 ${
                          isEven
                            ? "top-0 h-[220px]"
                            : "top-[268px] h-[calc(100%-268px)]"
                        }`}
                      />

                      <div className={`flex flex-col items-center ${!isEven ? "flex-col-reverse" : ""}`}>

                        {/* Cover card */}
                        <div className={isEven ? "mb-12" : "mt-12"}>
                          <div
                            onClick={() => canOpenPdf && setSelectedIssue(issue)}
                            className={`w-[180px] h-[240px] relative group shadow-xl rounded-sm overflow-hidden p-4 flex flex-col justify-between ${
                              canOpenPdf ? "cursor-pointer" : "cursor-not-allowed"
                            }`}
                            style={{ background: "#b45309" }}
                          >
                            {coverImageUrl && (
                              <img
                                src={coverImageUrl}
                                alt={issue.title}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            )}

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-stone-950/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center px-4 gap-2">
                              <div className="text-xs font-bold tracking-widest uppercase text-[#f97316]">
                                {formattedDate}
                              </div>
                              <div className="text-white text-sm italic leading-snug line-clamp-3">{issue.title}</div>
                              <div className="text-white text-[11px] tracking-widest uppercase mt-1">
                                {canOpenPdf ? "Read Issue" : "PDF Unavailable"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Timeline dot */}
                        <div className="relative z-10">
                          <div
                            className="w-12 h-12 rounded-full border-4 bg-background shadow-lg flex items-center justify-center"
                            style={{ borderColor: "#b45309" }}
                          >
                            <div
                              className="text-[9px] font-bold text-center leading-tight"
                              style={{ color: "#b45309" }}
                            >
                              {year}
                            </div>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className={isEven ? "mt-12" : "mb-12"}>
                          <div className="text-center w-[200px]">
                            <div className="text-base font-heading font-bold mb-1 text-[#b45309]">{formattedDate}</div>
                            <div className="text-sm font-serif italic mb-1 text-foreground/70 leading-snug">
                              {issue.title}
                            </div>
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                              African Sun
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {africanSunIssues.length > 3 && (
              <div className="text-center mt-4 text-sm text-muted-foreground">
                ← Scroll to explore all issues →
              </div>
            )}

            {loadingIssues && (
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Loading archive issues...
              </div>
            )}

            {!loadingIssues && africanSunIssues.length === 0 && (
              <div className="text-center mt-4 text-sm text-muted-foreground">
                No African Sun issues available yet.
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-8 italic">
            Click any card to open the full issue PDF. Archives for BOP and Uwezo coming soon.
          </p>
        </div>
      </section>

      {/* PDF READER MODAL */}
      {selectedIssue && getPdfUrl(selectedIssue) && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedIssue(null)} />

          <div className="relative w-full max-w-7xl mx-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-3">
              <div className="text-white text-sm opacity-80">{selectedIssue.title}</div>
              <Button onClick={() => setSelectedIssue(null)} variant="ghost" className="text-white">
                Close
              </Button>
            </div>

            <div className="rounded-xl overflow-hidden shadow-2xl">
              <PDFViewer pdfUrl={getPdfUrl(selectedIssue)!} onClose={() => setSelectedIssue(null)} />
            </div>
          </div>
        </div>
      )}

      {/* ── WHAT BSJ INHERITS ───── */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <span className="text-xs font-bold tracking-widest uppercase text-[#f97316] mb-3 block">The throughline</span>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground mb-4 leading-tight">
            What BSJ Inherits
          </h2>
          <p className="font-serif text-muted-foreground text-lg max-w-2xl mb-12">
            The Black Star Journal is not a departure from this history — it is its continuation. Here is what was passed down.
          </p>
          <div className="flex flex-col gap-6">
            {BSJ_CONNECTION_POINTS.map((pt, i) => (
              <div key={i} className="flex gap-5 items-start bg-muted/30 border border-border rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#f97316] flex-shrink-0 flex items-center justify-center text-white font-bold font-heading">
                  {i + 1}
                </div>
                <div>
                  <div className="font-heading font-black text-foreground text-lg mb-1">{pt.label}</div>
                  <div className="text-[#f97316] text-xs tracking-widest uppercase mb-2">{pt.connector}</div>
                  <p className="font-serif text-muted-foreground text-sm leading-relaxed">{pt.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}