import { useEffect, useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { backendApiUrl, resolveBackendAssetUrl, resolveR2AssetUrl } from "@/lib/api";

interface Media {
  filename?: string | null;
  url?: string | null;
  alt?: string | null;
}

const staffData = [
  {
    id: "editors-in-chief",
    title: "Editors-in-Chief",
    members: [
      { role: "Editor-in-Chief", name: "Nelsa Tiemtoré" },
      { role: "Editor-in-Chief", name: "Kourtney Beauvais" }
    ]
  },
  {
    id: "managing-editor",
    title: "Managing Editor",
    members: [
      { role: "Managing Editor", name: "Destiny Kristina" },
      { role: "Managing Editor", name: "Don Shombusho" }
    ]
  },
  {
    id: "advisor",
    title: "Advisor",
    members: [{ role: "Advisor", name: "Destiny Wilson" }]
  },
  {
    id: "treasurer",
    title: "Treasurer",
    members: [{ role: "Treasurer", name: "Kaliyah Graham" }]
  },
  {
    id: "copy-editor",
    title: "Copy Editor",
    members: [{ role: "Copy Editor", name: "Eniola Okon" }]
  },
  {
    id: "arts-culture",
    title: "Arts & Culture",
    members: [
      { role: "Section Editor", name: "Nina Jeffries-El" },
      { role: "Section Editor", name: "Mansie Bennett" },
      { role: "Staff Writer", name: "Emmanuel Chery" },
      { role: "Staff Writer", name: "Nyjah Harrison" },
      { role: "Staff Writer", name: "Mounika Katta" },
      { role: "Staff Writer", name: "Chanel Baxter" },
      { role: "Staff Writer", name: "Daniel Nkalubo" },
      { role: "Staff Writer", name: "Natalie Payne" },
      { role: "Staff Writer", name: "Asya Gipson" },
      { role: "Staff Writer", name: "Alexandria Goodman" }
    ]
  },
  {
    id: "columns",
    title: "Columns",
    members: [
      { role: "Section Editor", name: "Destiny Kristina" },
      { role: "Section Editor", name: "Paris Carney" },
      { role: "Staff Writer", name: "Yenee Berta" },
      { role: "Staff Writer", name: "Sonam Shulman" },
      { role: "Staff Writer", name: "Favour Akpokiere" },
      { role: "Staff Writer", name: "Rohey Jasseh" },
      { role: "Staff Writer", name: "Riki Doumbia" }
    ]
  },
  {
    id: "stories",
    title: "Stories",
    members: [
      { role: "Section Editor", name: "Zahira Walker" },
      { role: "Staff Writer", name: "Jannah Maguire" },
      { role: "Staff Writer", name: "Nyria Delph" },
      { role: "Staff Writer", name: "Julie Hajducky" }
    ]
  },
  {
    id: "society-news",
    title: "Society & News",
    members: [
      { role: "Section Editor", name: "Don Shumbusho" },
      { role: "Section Editor", name: "Ava Sharma" },
      { role: "Staff Writer", name: "Izu Obialo" },
      { role: "Staff Writer", name: "Rashaun Bertrand" },
      { role: "Staff Writer", name: "Zoe Plunkett" }
    ]
  },
  {
    id: "content",
    title: "Content",
    members: [
      { role: "Content Lead", name: "Nina Jeffries-El" },
      { role: "Content Creator", name: "Aisosa Idahosa" },
      { role: "Content Creator", name: "Rita Beyene" },
      { role: "Content Creator (Photographer)", name: "Farhiyo Omar" },
      { role: "Content Creator", name: "Moana Marx" },
      { role: "Content Creator", name: "Jordan Kinley" },
      { role: "Content Creator", name: "Kierra Reese" },
      { role: "Content Creator", name: "Yenee Berta" },
      { role: "Content Creator", name: "Kayla Randolph" },
      { role: "Content Creator", name: "Shamari Reed" },
      { role: "Content Creator (Photographer)", name: "Laeticia Paul" }
    ]
  },
  {
    id: "social",
    title: "Social",
    members: [
      { role: "Social Lead", name: "Ramatoulaye Tall" },
      { role: "Social Media Content Creator", name: "Kierra Reese" },
      { role: "Social Media Content Creator", name: "Laeticia Paul" }
    ]
  },
  {
    id: "website",
    title: "Website",
    members: [
      { role: "Website Co-Lead", name: "Mamadou Kouyate" },
      { role: "Website Co-Lead", name: "Pierre Joseph" }
    ]
  },
  {
    id: "layout",
    title: "Layout",
    members: [
      { role: "Team Member", name: "Nina Jeffries-El" },
      { role: "Team Member", name: "Sydney Johnson" }
    ]
  },
  {
    id: "community-liaison-event-coordinator",
    title: "Community Liaison / Event Coordinator",
    members: [
      { role: "Coordinator", name: "Sage Freeman" },
      { role: "Coordinator", name: "Imani Moneyang" },
      { role: "Coordinator", name: "Feker Wolde" }
    ]
  },
  {
    id: "archiving",
    title: "Archiving",
    members: [
      { role: "Co-Archivist", name: "Vera Koontz" },
      { role: "Co-Archivist", name: "Mares Bustamante-Donawa" }
    ]
  }
];

export default function Team() {
  usePageTitle('Our Team');
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [teamHeroMedia, setTeamHeroMedia] = useState<Media | null>(null);
  const [cofoundersMedia, setCofoundersMedia] = useState<Media | null>(null);
  const [loadingCofoundersMedia, setLoadingCofoundersMedia] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCofoundersMedia = async () => {
      setLoadingCofoundersMedia(true);

      try {
        const tryFetchByAlt = async (altValue: string): Promise<Media | null> => {
          const response = await fetch(
            backendApiUrl(`/api/media?where[alt][equals]=${encodeURIComponent(altValue)}&limit=1&depth=0`)
          );

          if (!response.ok) {
            return null;
          }

          const data = await response.json();
          const docs = Array.isArray(data?.docs) ? (data.docs as Media[]) : [];
          return docs[0] ?? null;
        };

        const [heroMatch, cofoundersMatch] = await Promise.all([
          tryFetchByAlt("teambg"),
          tryFetchByAlt("cofounders"),
        ]);

        if (!mounted) return;
        setTeamHeroMedia(heroMatch);
        setCofoundersMedia(cofoundersMatch);
      } catch (error) {
        if (mounted) {
          console.error("Failed to load cofounders media", error);
          setTeamHeroMedia(null);
          setCofoundersMedia(null);
        }
      } finally {
        if (mounted) {
          setLoadingCofoundersMedia(false);
        }
      }
    };

    loadCofoundersMedia();

    return () => {
      mounted = false;
    };
  }, []);

  const cofoundersImageUrlRaw = resolveR2AssetUrl(cofoundersMedia);
  const cofoundersImageUrl = cofoundersImageUrlRaw
    ? resolveBackendAssetUrl(cofoundersImageUrlRaw)
    : undefined;

  const teamHeroImageUrlRaw = resolveR2AssetUrl(teamHeroMedia);
  const teamHeroImageUrl = teamHeroImageUrlRaw
    ? resolveBackendAssetUrl(teamHeroImageUrlRaw)
    : undefined;

  return (
    <div className="pb-20">

      {/* Hero — keep exactly as you have it, it's great */}
      <section className="relative py-24 text-center overflow-hidden bg-[#000000]">
        {teamHeroImageUrl && (
          <>
            <img
              src={teamHeroImageUrl}
              alt="The Team"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </>
        )}
        <div className="relative z-10 text-center space-y-4 px-4">
          <img
            src="/images/who_are_us.png"
            alt="Who We Are"
            className="max-w-3xl mx-auto w-full"
          />
          <p className="font-serif text-xl max-w-2xl mx-auto text-gray-200">
            The voices, the stories, and the people behind The Black Star Journal.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl">

        {/* ── Origin Story ── */}
        <section className="py-16 border-b border-border">
          <p className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-[#f97316] mb-4">
            How It Started
          </p>
          <h2 className="font-heading font-black text-3xl md:text-4xl mb-6 leading-tight">
            Built from an absence.
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              The Black Star Journal was born from an absence. In 2021, Amiri Nash '24 -
              writer, activist, and Washington D.C.'s Youth Poet Laureate - spent months
              searching Brown's archives for evidence of what Black student life had looked
              like for generations before him. Newspaper clippings, photographs, and primary
              sources spanning decades. What he found was a near-total silence.
            </p>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              So he decided to fill it. Nash reached out to Keiley Thompson '24, a fellow
              writer who had already started her own online publication during the height of
              the Black Lives Matter movement. Together, they co-founded The Black Star
              Journal, Brown's first Black student newspaper, launching their inaugural
              20-page issue in February 2022. From the start, they looked to the Black
              Panther Party's newspaper as a model, rejecting what Thompson called the
              "white institutional lens" of mainstream press so BSJ could center Black joy,
              Black accomplishment, and Black life.
            </p>
          </div>

          {(cofoundersImageUrl || loadingCofoundersMedia) && (
            <figure className="mt-10">
              <div className="rounded-xl overflow-hidden border border-border bg-card shadow-2xl">
                {cofoundersImageUrl ? (
                  <img
                    src={cofoundersImageUrl}
                    alt={cofoundersMedia?.alt || "BSJ co-founders"}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-[300px] w-full flex items-center justify-center text-sm text-muted-foreground">
                    Loading co-founders image...
                  </div>
                )}
              </div>
              <figcaption className="mt-3 text-sm font-serif text-muted-foreground">
                Co-founders Amiri Nash '24 and Keiley Thompson '24. Photo by Philip Keith. 
              </figcaption>
            </figure>
          )}

          {/* Pull quote */}
          <blockquote className="mt-10 border-l-4 border-[#f97316] pl-6">
            <p className="font-serif text-xl italic leading-relaxed">
              "I struggled to find any evidence of our existence. That's when I realized
              Brown needed its own Black student newspaper — not only to document the
              present, but to serve as a primary source for future generations."
            </p>
            <footer className="mt-3 font-sans text-sm text-muted-foreground tracking-wide">
              — Amiri Nash '24, Co-founder
            </footer>
          </blockquote>

          {/* Press links */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="https://www.brownalumnimagazine.com/articles/2022-06-09/a-star-is-born"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-xs font-bold tracking-[0.15em] uppercase text-[#f97316] hover:underline"
            >
              Read the Brown Alumni Magazine feature →
            </a>
          </div>
        </section>

        {/* ── Current Team ── */}
        <section className="py-16 space-y-2">
          <p className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-[#f97316] mb-2">
            The Masthead
          </p>
          <h2 className="font-heading font-black text-3xl md:text-4xl mb-10">
            Our BSJ Team
          </h2>

          {staffData.map((section) => {
            const isOpen = openSection === section.id;
            return (
              <div key={section.id} className="border-t border-border">
                <button
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className="w-full flex items-center justify-between py-4 text-left group"
                >
                  <span className="font-heading font-bold text-lg group-hover:text-[#f97316] transition-colors">
                    {section.title}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="font-sans text-xs text-muted-foreground tabular-nums">
                      {section.members.length}
                    </span>
                    <span
                      className="text-[#f97316] text-lg leading-none transition-transform duration-200"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    >
                      +
                    </span>
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                      {section.members.map((member, i) => (
                        <div key={i} className="text-center group">
  
                            {/* Avatar circle */}
                            <div className="aspect-square rounded-full mb-3 overflow-hidden relative mx-auto max-w-[120px] bg-black border-2 border-[#f97316]/30 flex items-center justify-center group-hover:border-[#f97316] transition-colors duration-300">
                              <span className="font-sans font-black text-xl text-[#f97316]">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join("")}
                              </span>
                            </div>

                            <h4 className="font-bold text-sm">{member.name}</h4>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                              {member.role}
                            </p>

                          </div>
                                                ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div className="border-t border-border" />
        </section>

      </div>
    </div>
  );
}