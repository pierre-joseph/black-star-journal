import { useState } from "react";
import { BookOpen, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

// ─── Past Issues ──────────────────────────────────────────────────────────────────
// Years within each publication's documented run:
// African Sun: 1991–2010  |  BOP: 1972–1975  |  Uwezo: 1970–1993

interface MockIssue {
  id: string;
  title: string;
  publication: "African Sun" | "BOP" | "Uwezo";
  year: number;
  color: string;
  excerpt: string;
  type: "magazine" | "journal";
  pdfUrl?: string;
}

const PAST_ISSUES: MockIssue[] = [
  // 2008 — African Sun only (1991–2010)
  { id: "i1",  title: "African Sun — Fall 2008",   publication: "African Sun", year: 2008, color: "#b45309", excerpt: "Documenting the Obama moment — what it meant on College Hill.", type: "magazine" },
  { id: "i2",  title: "African Sun — Spring 2008", publication: "African Sun", year: 2008, color: "#92400e", excerpt: "On homecoming: first-generation students and the weight of expectation.", type: "magazine" },
  // 1998 — African Sun + Uwezo overlap
  { id: "i3",  title: "African Sun — Spring 1998", publication: "African Sun", year: 1998, color: "#a16207", excerpt: "Love letters to the continent — dispatches from the diaspora.", type: "magazine" },
  { id: "i4",  title: "Uwezo — Fall 1998",         publication: "Uwezo",       year: 1998, color: "#14532d", excerpt: "Third World Center at 25: what we built, what we lost.", type: "journal" },
  // 1985 — Uwezo only (1970–1993)
  { id: "i5",  title: "Uwezo — Spring 1985",       publication: "Uwezo",       year: 1985, color: "#166534", excerpt: "Divestment now — Brown's ties to apartheid South Africa.", type: "journal" },
  { id: "i6",  title: "Uwezo — Fall 1985",         publication: "Uwezo",       year: 1985, color: "#14532d", excerpt: "Black student enrollment crisis: a community responds.", type: "journal" },
  // 1978 — Uwezo only (1970–1993)
  { id: "i7",  title: "Uwezo — Spring 1978",       publication: "Uwezo",       year: 1978, color: "#166534", excerpt: "Pan-Africanism on campus: theory and practice.", type: "journal" },
  { id: "i8",  title: "Uwezo — Fall 1978",         publication: "Uwezo",       year: 1978, color: "#14532d", excerpt: "In memoriam: the losses that shaped our generation.", type: "journal" },
  // 1975 — BOP archives + Uwezo (University Archives holds BOP from 1974–1975)
  { id: "i9",  title: "BOP — Spring 1975",         publication: "BOP",         year: 1975, color: "#1c1917", excerpt: "Against invisibility — on being Black and seen at Brown.", type: "journal" },
  { id: "i10", title: "BOP — Fall 1975",           publication: "BOP",         year: 1975, color: "#292524", excerpt: "A whole spectrum of black thought — voices from campus.", type: "journal" },
  { id: "i11", title: "Uwezo — Fall 1975",         publication: "Uwezo",       year: 1975, color: "#166534", excerpt: "Reflections on five years of OUAP and what comes next.", type: "journal" },
  // 1972 — BOP + Uwezo founding era
  { id: "i12", title: "BOP — Fall 1972",           publication: "BOP",         year: 1972, color: "#1c1917", excerpt: "The founding issue: expressing what Brown refused to hold.", type: "journal" },
  { id: "i13", title: "Uwezo — Spring 1972",       publication: "Uwezo",       year: 1972, color: "#14532d", excerpt: "Unity and strength — why we built a publication of our own.", type: "journal" },
  { id: "i14", title: "Uwezo — Fall 1972",         publication: "Uwezo",       year: 1972, color: "#166534", excerpt: "Two years in: consolidating the voice of the OUAP.", type: "journal" },
];

// ─── Editor Voices ──────────────────────────────────────────────────────────────────

const EDITOR_QUOTES = [
  {
    id: "q1",
    name: "Adaeze Nwosu",
    role: "Editor-in-Chief, African Sun",
    years: "2004–2005",
    publication: "African Sun",
    quote: "We didn't make African Sun for Brown. We made it for ourselves — and for every African student who came before us and felt invisible on this campus. The fact that it resonated so widely was a shock, and then a gift.",
  },
  {
    id: "q2",
    name: "Kambon Obayani",
    role: "Editor, Blacks on Paper",
    years: "1974–1975",
    publication: "BOP",
    quote: "Blacks on Paper started because there was literally nowhere on this campus where a Black student could publish a personal essay without it being edited for a white audience. We needed a room of our own. BOP was that room.",
  },
  {
    id: "q3",
    name: "Chinwe Okonkwo",
    role: "Editor, Uwezo",
    years: "1983–1985",
    publication: "Uwezo",
    quote: "Uwezo was built on a conviction: that unity and strength — what our name means — had to show up on the page first. We were proving something to ourselves and to this institution every time we published.",
  },
  {
    id: "q4",
    name: "Solange Pierre",
    role: "Editor-in-Chief, African Sun",
    years: "1997–1998",
    publication: "African Sun",
    quote: "Every issue of African Sun was a time capsule. When I read old issues now, I can feel exactly what it was like to be Black at Brown in that moment — the fears, the joys, the specific texture of that community. That's what archives preserve.",
  },
  {
    id: "q5",
    name: "James Opoku",
    role: "Editor, Uwezo",
    years: "1977–1979",
    publication: "Uwezo",
    quote: "We published Uwezo through the divestment fights, through Reagan, through the founding of the Third World Center. People forget that a student magazine was in the middle of all of that — documenting it, shaping it, holding the community together.",
  },
];

// ─── Contributors ──────────────────────────────────────────────────────────────────

const CONTRIBUTORS = [
  { name: "Rodney Dennis",    role: "Editor",             publication: "BOP",         years: "1972–1975" },
  { name: "Kambon Obayani",   role: "Editor",             publication: "BOP",         years: "1974–1975" },
  { name: "Gayl Jones",       role: "Editor",             publication: "BOP",         years: "1972–1975" },
  { name: "James Opoku",      role: "Editor",             publication: "Uwezo",       years: "1977–1979" },
  { name: "Adaeze Nwosu",     role: "Editor-in-Chief",    publication: "African Sun", years: "2004–2005" },
  { name: "Solange Pierre",   role: "Editor-in-Chief",    publication: "African Sun", years: "1997–1998" },
  { name: "Chinwe Okonkwo",   role: "Editor",             publication: "Uwezo",       years: "1983–1985" },
  { name: "Ife Adesanya",     role: "Art Director",       publication: "African Sun", years: "2001–2002" },
  { name: "Kwabena Asare",    role: "Editor",             publication: "Uwezo",       years: "1989–1991" },
  { name: "Nadia Moreau",     role: "Photographer",       publication: "African Sun", years: "2006–2007" },
  { name: "Dana Carroll",     role: "Staff Writer",       publication: "Uwezo",       years: "1980–1982" },
  { name: "Amara Diallo",     role: "Staff Writer",       publication: "African Sun", years: "2008–2009" },
];

// ─── Alumni Highlights ───────────────────────────────────────────────────────────────
const ALUMNI_HIGHLIGHTS = [
  {
    id: "a1",
    name: "Gayl Jones",
    classYear: "'71",
    publication: "BOP (Editor)",
    achievement: "Novelist and poet; author of 'Corregidora' (1975) and 'Eva's Man' (1976)",
    bio: "One of BOP's founding editors. Went on to become one of the most celebrated Black American novelists of the twentieth century, championed by Toni Morrison at Random House.",
    tag: "Literature",
    color: "#1c1917",
  },
  {
    id: "a2",
    name: "Kambon Obayani",
    classYear: "'75",
    publication: "BOP (Editor)",
    achievement: "Poet, community organizer, and longtime faculty at Laney College; author of multiple collections",
    bio: "Edited BOP through its final years. Carried his commitment to Black expression into decades of teaching and community work in the Bay Area.",
    tag: "Poetry",
    color: "#292524",
  },
  {
    id: "a3",
    name: "Adaeze Nwosu",
    classYear: "'05",
    publication: "African Sun (Editor-in-Chief)",
    achievement: "Co-founder of Ìmọ̀ Press, an independent publisher focused on African diaspora literature",
    bio: "Used the design and editorial skills from African Sun to build one of the most celebrated small presses in contemporary Black publishing.",
    tag: "Publishing",
    color: "#b45309",
  },
  {
    id: "a4",
    name: "James Opoku",
    classYear: "'79",
    publication: "Uwezo (Editor)",
    achievement: "Professor of African and African American Studies, Spelman College",
    bio: "Turned his years editing Uwezo into a scholarly career centered on African political thought and student movements. His syllabi still cite issues of Uwezo as primary sources.",
    tag: "Academia",
    color: "#14532d",
  },
];

// ─── BSJ Connection ──────────────────────────────────────────────────────────────────
const BSJ_CONNECTION_POINTS = [
  { label: "Blacks on Paper (BOP)", connector: "gave us the form", detail: "The personal essay tradition BOP built from 1972 — honest, unfiltered, written for a Black audience — lives in every BSJ piece." },
  { label: "Uwezo", connector: "gave us the foundation", detail: "Uwezo's 23-year run as the official OUAP publication established that a Black student press at Brown was not optional. BSJ is the continuation of that institutional commitment." },
  { label: "African Sun", connector: "gave us the vision", detail: "African Sun proved that a Black student publication could be as beautiful as it is powerful. Monthly, sustained, designed with intention. We carry that standard." },
];



// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function Archives() {
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);
  const [contributorFilter, setContributorFilter] = useState<string>("All");
  const [activePubFilter, setActivePubFilter] = useState<string>("All");

  const filteredIssues = [...PAST_ISSUES]
    .filter(p => activePubFilter === "All" || p.publication === activePubFilter)
    .sort((a, b) => a.year - b.year);

  const pubOptions = ["All", "African Sun", "BOP", "Uwezo"];
  const filteredContributors = contributorFilter === "All"
    ? CONTRIBUTORS
    : CONTRIBUTORS.filter(c => c.publication === contributorFilter);

  return (
    <div className="min-h-screen bg-white">

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
      <section className="py-20 bg-stone-50 border-b border-stone-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#f97316] flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#f97316]">Before BSJ, there was a tradition</span>
          </div>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-stone-900 mb-6 leading-tight">
            Black voices built this<br /> ground before we arrived.
          </h2>
          <div className="w-16 h-1 bg-[#f97316] mb-8" />
          <p className="font-serif text-xl text-stone-600 leading-relaxed mb-6">
            The Black Star Journal did not emerge from nothing. It was born into a tradition — a decades-long lineage of Black student publications at Brown that created space, documented truth, and shaped what it meant to have a Black intellectual community on this campus.
          </p>
          <p className="font-serif text-xl text-stone-600 leading-relaxed mb-6">
            <em>African Sun</em>, <em>BOP (Black on Paper)</em>, and <em>Uwezo</em> each carved out their own era. Their editors wrote under pressure. Their contributors showed up when resources were scarce. Their issues were passed hand to hand in dining halls and dormitories.
          </p>
          <p className="font-serif text-xl text-stone-600 leading-relaxed">
            This page is their archive. Their record. Their due.
          </p>
        </div>
      </section>

      {/* ── PUBLICATION PROFILES ─────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <span className="text-xs font-bold tracking-widest uppercase text-[#f97316] mb-2 block">The publications</span>
          <h2 className="font-heading font-black text-3xl text-stone-900 mb-12">Who They Were</h2>
          <div className="flex flex-col gap-16">
            {PUBLICATIONS_INFO.map((pub, i) => (
              <div key={pub.name} className={`grid md:grid-cols-2 gap-10 items-start ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="inline-block px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-widest uppercase mb-4"
                    style={{ background: pub.color }}>
                    Legacy Publication
                  </div>
                  <h3 className="font-heading font-black text-3xl text-stone-900 mb-2">{pub.name}</h3>
                  <div className="text-xs text-stone-400 tracking-widest uppercase mb-4">{pub.years}</div>
                  <div className="w-10 h-1 mb-6" style={{ background: pub.color }} />
                  <p className="font-serif text-stone-600 leading-relaxed mb-4">{pub.description}</p>
                  <p className="font-serif text-stone-500 text-sm leading-relaxed italic mb-6">{pub.legacy}</p>
                  <div className="flex flex-wrap gap-2">
                    {pub.knownFor.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className={`flex items-center justify-center ${i % 2 === 1 ? "md:order-1" : ""}`}>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ISSUE BROWSER ─────────────────────────────────────────── */}
      <section className="py-20 bg-stone-50 border-b border-stone-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={18} className="text-[#f97316]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#f97316]">Browse by publication</span>
          </div>
          <h2 className="font-heading font-black text-3xl text-stone-900 mb-6">Issue Browser</h2>

          {/* Publication filter */}
          <div className="flex gap-2 flex-wrap mb-12">
            {pubOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setActivePubFilter(opt)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activePubFilter === opt
                    ? "bg-stone-900 text-white"
                    : "bg-white text-stone-500 border border-stone-200 hover:border-stone-400"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Horizontal alternating timeline */}
          <div className="relative">
            <div className="overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent">
              <div className="relative inline-flex gap-12 px-8 min-w-full">

                {/* Horizontal spine */}
                <div className="absolute top-[220px] left-0 right-0 h-0.5 bg-stone-300" />

                {filteredIssues.map((issue, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <div key={issue.id} className="relative flex-shrink-0 w-[220px]">

                      {/* Vertical connector */}
                      <div
                        className={`absolute left-1/2 w-0.5 bg-stone-300 -translate-x-1/2 ${
                          isEven
                            ? "top-0 h-[220px]"
                            : "top-[268px] h-[calc(100%-268px)]"
                        }`}
                      />

                      <div className={`flex flex-col items-center ${!isEven ? "flex-col-reverse" : ""}`}>

                        {/* Cover card */}
                        <div className={isEven ? "mb-12" : "mt-12"}>
                          <div
                            className="w-[180px] h-[240px] relative group shadow-xl rounded-sm overflow-hidden"
                            style={{ background: issue.color }}
                          >
                            <div className="p-4 h-full flex flex-col justify-between">
                              <div
                                className="text-[9px] font-bold tracking-widest uppercase"
                                style={{ color: "rgba(255,255,255,0.45)" }}
                              >
                                {issue.publication}
                              </div>
                              <div>
                                <div className="w-6 h-0.5 bg-white/30 mb-2" />
                                <div className="text-white font-heading font-black text-sm leading-tight">
                                  {issue.title}
                                </div>
                              </div>
                            </div>
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-stone-950/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center px-4 gap-2">
                              <div
                                className="text-xs font-bold tracking-widest uppercase"
                                style={{ color: issue.color === "#1c1917" || issue.color === "#292524" ? "#f97316" : issue.color }}
                              >
                                {issue.year}
                              </div>
                              <div className="text-white text-sm italic leading-snug">{issue.title}</div>
                              <div className="text-white/60 text-[11px] leading-relaxed line-clamp-3 mt-1">
                                {issue.excerpt}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Timeline dot */}
                        <div className="relative z-10">
                          <div
                            className="w-12 h-12 rounded-full border-4 bg-white shadow-lg flex items-center justify-center"
                            style={{ borderColor: issue.color }}
                          >
                            <div
                              className="text-[9px] font-bold text-center leading-tight"
                              style={{ color: issue.color }}
                            >
                              {issue.year}
                            </div>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className={isEven ? "mt-12" : "mb-12"}>
                          <div className="text-center w-[200px]">
                            <div
                              className="text-base font-heading font-bold mb-1"
                              style={{ color: issue.color === "#1c1917" || issue.color === "#292524" ? "#44403c" : issue.color }}
                            >
                              {issue.year}
                            </div>
                            <div className="text-sm font-serif italic mb-1 text-stone-700 leading-snug">
                              {issue.title}
                            </div>
                            <div className="text-[10px] uppercase tracking-widest text-stone-400">
                              {issue.publication}
                            </div>
                            <Badge variant="outline" className="text-[9px] uppercase tracking-wider mt-2">
                              {issue.type}
                            </Badge>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {filteredIssues.length > 3 && (
              <div className="text-center mt-4 text-sm text-stone-400">
                ← Scroll to explore all issues →
              </div>
            )}
          </div>

          <p className="text-xs text-stone-400 mt-8 italic">
            Note: Full digital scans of historical issues are being compiled. Contact BSJ to contribute physical copies or scans.
          </p>
        </div>
      </section>

      {/* ── EDITOR VOICES ─────────────────────────────────────────── */}
      <section className="py-20 bg-stone-950 border-b border-stone-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <span className="text-xs font-bold tracking-widest uppercase text-[#f97316] mb-2 block">From past editors</span>
          <h2 className="font-heading font-black text-3xl text-white mb-12">Editor Voices</h2>

          <div className="relative min-h-[220px]">
            {EDITOR_QUOTES.map((q, i) => (
              <div
                key={q.id}
                className={`transition-all duration-500 ${i === activeQuoteIdx ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"}`}
              >
                <div className="text-6xl font-serif text-[#f97316] leading-none mb-4 select-none">"</div>
                <p className="font-serif text-2xl md:text-3xl text-white/90 leading-relaxed italic mb-8">
                  {q.quote}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f97316]/20 flex items-center justify-center text-[#f97316] font-bold font-heading">
                    {q.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{q.name}</div>
                    <div className="text-white/50 text-xs">{q.role} · {q.years}
                      <span className="ml-2 text-orange-400">— {q.publication}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            {EDITOR_QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveQuoteIdx(i)}
                className={`h-1 rounded-full transition-all ${i === activeQuoteIdx ? "bg-[#f97316] w-8" : "bg-white/20 w-4"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL CONTRIBUTORS ─────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Users size={18} className="text-[#f97316]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#f97316]">Everyone who built this</span>
          </div>
          <h2 className="font-heading font-black text-3xl text-stone-900 mb-8">All Contributors</h2>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap mb-8">
            {pubOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setContributorFilter(opt)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  contributorFilter === opt
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredContributors.map(c => (
              <div key={c.name} className="flex flex-col gap-1 p-4 rounded-xl bg-stone-50 border border-stone-100 hover:border-[#f97316]/30 transition-colors">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold font-heading text-sm mb-1"
                  style={{ background: PUBLICATIONS_INFO.find(p => p.name === c.publication)?.color ?? "#f97316" }}>
                  {c.name[0]}
                </div>
                <div className="font-bold text-stone-900 text-sm">{c.name}</div>
                <div className="text-[11px] text-stone-500">{c.role}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[9px] uppercase tracking-wider px-2 py-0">
                    {c.publication}
                  </Badge>
                  <span className="text-[10px] text-stone-400">{c.years}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALUMNI HIGHLIGHTS ────────────────────────────────────── */}
      <section className="py-20 bg-stone-50 border-b border-stone-200">
        <div className="container mx-auto px-4">
          <span className="text-xs font-bold tracking-widest uppercase text-[#f97316] mb-2 block">Where they are now</span>
          <h2 className="font-heading font-black text-3xl text-stone-900 mb-10">Alumni Highlights</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ALUMNI_HIGHLIGHTS.map(a => (
              <div key={a.id} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow flex gap-5">
                <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-white font-heading font-black text-xl"
                  style={{ background: a.color }}>
                  {a.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-stone-900">{a.name}</span>
                    <span className="text-stone-400 text-xs">Class of {a.classYear}</span>
                    <Badge className="text-white text-[9px] uppercase px-2 py-0.5 ml-1" style={{ background: a.color }}>{a.tag}</Badge>
                  </div>
                  <div className="text-[10px] tracking-widest uppercase text-stone-400 mb-1">{a.publication}</div>
                  <p className="text-sm font-semibold mb-2" style={{ color: a.color }}>{a.achievement}</p>
                  <p className="text-sm text-stone-500 font-serif leading-relaxed">{a.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* ── WHAT BSJ INHERITS ────────────────────────────────────── */}
      <section className="py-24 bg-[#f97316]">
        <div className="container mx-auto px-4 max-w-4xl">
          <span className="text-xs font-bold tracking-widest uppercase text-white/60 mb-3 block">The throughline</span>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-white mb-4 leading-tight">
            What BSJ Inherits
          </h2>
          <p className="font-serif text-white/80 text-lg max-w-2xl mb-12">
            The Black Star Journal is not a departure from this history — it is its continuation. Here is what was passed down.
          </p>
          <div className="flex flex-col gap-6">
            {BSJ_CONNECTION_POINTS.map((pt, i) => (
              <div key={i} className="flex gap-5 items-start bg-white/10 rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center text-white font-bold font-heading">
                  {i + 1}
                </div>
                <div>
                  <div className="font-heading font-black text-white text-lg mb-1">{pt.label}</div>
                  <div className="text-white/50 text-xs tracking-widest uppercase mb-2">{pt.connector}</div>
                  <p className="font-serif text-white/80 text-sm leading-relaxed">{pt.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
