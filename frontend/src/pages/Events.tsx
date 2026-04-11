import { useEffect, useState } from "react";
import { CalendarDays, ImageIcon } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { backendApiUrl, resolveR2AssetUrl } from "@/lib/api";
import { FadeIn } from "@/components/FadeIn";

interface Media {
  id?: string;
  filename?: string | null;
  url?: string | null;
  alt?: string | null;
}

interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  payloadAltPrefix: string;
  blurb: string;
}

interface EventPhoto {
  id: string;
  imageUrl: string;
  alt: string;
}

const EVENT_ITEMS: EventItem[] = [
  {
    id: "black-star-expo",
    title: "Black Star Expo",
    subtitle: "Showcasing Black student creativity and collaboration",
    payloadAltPrefix: "Event-Black-Star-Expo",
    blurb:
      "The Black Star Expo is our celebration of Black artistry, scholarship, and innovation across campus. Through live showcases, conversations, and creative installations, this event brings students, alumni, and community members together to honor the range of Black expression at Brown.",
  },
  {
    id: "bsj-gala",
    title: "BSJ Gala",
    subtitle: "An evening of recognition, storytelling, and joy",
    payloadAltPrefix: "Event-BSJ-Gala",
    blurb:
      "The BSJ Gala is a signature night dedicated to the people and stories that sustain our publication. We gather to celebrate our contributors, reflect on the year, and recognize the work of Black students who continue to shape campus culture through writing, art, and leadership.",
  },
  {
    id: "bsj-holiday-party",
    title: "BSJ Holiday Party",
    subtitle: "Community, care, and end-of-semester connection",
    payloadAltPrefix: "Event-BSJ-Holiday-Party",
    blurb:
      "Our holiday party creates space to pause, reconnect, and celebrate one another beyond deadlines and deliverables. It is a warm gathering centered on fellowship, laughter, and gratitude, reflecting the relationships that make BSJ feel like home.",
  }
];

const matchesEventPrefix = (altValue: string, prefix: string): boolean =>
  altValue === prefix || altValue.startsWith(`${prefix}-`) || altValue.startsWith(`${prefix}_`);

const sortMediaByAlt = (items: Media[]): Media[] =>
  [...items].sort((a, b) =>
    (a.alt ?? "").localeCompare(b.alt ?? "", undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );

const toEventPhotos = (eventId: string, eventTitle: string, mediaItems: Media[]): EventPhoto[] =>
  mediaItems
    .map((mediaItem, mediaIndex) => {
      const imageUrl = resolveR2AssetUrl(mediaItem);
      if (!imageUrl) return null;

      return {
        id: mediaItem.id ?? `${eventId}-${mediaIndex}`,
        imageUrl,
        alt: mediaItem.alt || `${eventTitle} event photo ${mediaIndex + 1}`,
      };
    })
    .filter((mediaItem): mediaItem is EventPhoto => mediaItem !== null);

export default function Events() {
  usePageTitle("Events");

  const [eventMediaById, setEventMediaById] = useState<Record<string, Media[]>>({});
  const [loadingMedia, setLoadingMedia] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadEventMedia = async () => {
      setLoadingMedia(true);

      try {
        const mediaMap = Object.fromEntries(
          EVENT_ITEMS.map((eventItem) => [eventItem.id, [] as Media[]])
        ) as Record<string, Media[]>;

        let page = 1;
        let totalPages = 1;

        while (page <= totalPages) {
          const response = await fetch(
            backendApiUrl(`/api/media?limit=100&depth=0&page=${page}&sort=alt`)
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch event media: ${response.status}`);
          }

          const data = await response.json();
          const docs = Array.isArray(data?.docs) ? (data.docs as Media[]) : [];

          docs.forEach((mediaItem) => {
            const altValue = (mediaItem.alt || "").trim();
            if (!altValue) return;

            const matchedEvent = EVENT_ITEMS.find((eventItem) =>
              matchesEventPrefix(altValue, eventItem.payloadAltPrefix)
            );

            if (matchedEvent) {
              mediaMap[matchedEvent.id].push(mediaItem);
            }
          });

          const parsedTotalPages =
            typeof data?.totalPages === "number" && data.totalPages > 0 ? data.totalPages : 1;

          totalPages = parsedTotalPages;
          page += 1;
        }

        if (!mounted) return;

        EVENT_ITEMS.forEach((eventItem) => {
          mediaMap[eventItem.id] = sortMediaByAlt(mediaMap[eventItem.id]);
        });

        setEventMediaById(mediaMap);
      } catch (error) {
        if (mounted) {
          console.error("Failed to load event media", error);
          setEventMediaById({});
        }
      } finally {
        if (mounted) {
          setLoadingMedia(false);
        }
      }
    };

    loadEventMedia();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="bg-[#f97316] py-24 text-center">
        <div className="container mx-auto px-4">
          <p className="text-white/70 text-sm font-bold tracking-widest uppercase mb-4">BSJ Community</p>
          <h1 className="font-heading font-black text-5xl md:text-8xl mb-6 text-white leading-tight">BSJ EVENTS</h1>
          <div className="w-24 h-1 bg-white/40 mx-auto mb-6" />
          <p className="font-serif text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Moments where Black stories move from the page into shared experience.
          </p>
        </div>
      </section>

      <section className="py-20 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeIn direction="up">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#f97316] flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#f97316]">Beyond the publication</span>
            </div>

            <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground mb-6 leading-tight">
              Building Black community,
              <br />
              one gathering at a time.
            </h2>
            <div className="w-16 h-1 bg-[#f97316] mb-8" />
            <p className="font-serif text-xl text-muted-foreground leading-relaxed">
              BSJ events create space for celebration, reflection, and connection across Brown's Black community.
              From formal evenings to community-centered gatherings, each moment extends our mission of amplifying
              Black voices and honoring Black life.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-20">
            {EVENT_ITEMS.map((eventItem, index) => {
              const isEven = index % 2 === 0;
              const eventPhotos = toEventPhotos(
                eventItem.id,
                eventItem.title,
                eventMediaById[eventItem.id] ?? []
              );

              return (
                <FadeIn key={eventItem.id} direction="up" delay={index * 80}>
                  <article className="grid md:grid-cols-12 gap-8 items-start border-b border-border pb-12 last:border-b-0 last:pb-0">
                    <div className={`md:col-span-7 ${isEven ? "" : "md:order-2"}`}>
                      {eventPhotos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {eventPhotos.map((eventPhoto, photoIndex) => {
                            const isLeadPhoto = photoIndex === 0;

                            return (
                              <div
                                key={eventPhoto.id}
                                className={`rounded-lg overflow-hidden border border-border bg-card shadow-sm ${
                                  isLeadPhoto ? "col-span-2 sm:col-span-3" : ""
                                }`}
                              >
                                <img
                                  src={eventPhoto.imageUrl}
                                  alt={eventPhoto.alt}
                                  className={`w-full object-cover transition-transform duration-300 hover:scale-105 ${
                                    isLeadPhoto ? "aspect-[16/10]" : "aspect-square"
                                  }`}
                                  loading="lazy"
                                />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-border bg-muted/40 aspect-[4/3] flex flex-col items-center justify-center px-6 text-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-3" />
                          <p className="text-sm font-semibold text-foreground mb-1">Event gallery coming soon</p>
                          <p className="text-xs text-muted-foreground">
                            Upload in Payload with alt values like
                            <span className="font-semibold text-foreground"> {eventItem.payloadAltPrefix}-01</span>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className={`md:col-span-5 ${isEven ? "" : "md:order-1"}`}>
                      <p className="text-xs font-bold tracking-widest uppercase text-[#f97316] mb-2">BSJ Event</p>
                      {eventPhotos.length > 0 && (
                        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                          {eventPhotos.length} {eventPhotos.length === 1 ? "Photo" : "Photos"}
                        </p>
                      )}
                      <h3 className="font-heading font-black text-3xl md:text-4xl mb-3 text-foreground">{eventItem.title}</h3>
                      <p className="text-sm uppercase tracking-wider text-muted-foreground mb-5">{eventItem.subtitle}</p>
                      <p className="font-serif text-lg text-muted-foreground leading-relaxed">{eventItem.blurb}</p>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>

          {loadingMedia && (
            <p className="text-center mt-10 text-sm text-muted-foreground">Loading event media...</p>
          )}
        </div>
      </section>
    </div>
  );
}
