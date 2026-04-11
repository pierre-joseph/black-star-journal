import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Palette } from 'lucide-react'

import { usePageTitle } from '@/hooks/usePageTitle'
import { backendApiUrl, resolveR2AssetUrl } from '@/lib/api'
import { getIssueDisplayLabel, getIssueRouteId, matchIssueByRouteId, sortIssuesByNewest } from '@/lib/issueRouting'
import { cn } from '@/lib/utils'

interface Media {
  filename?: string | null
  url?: string | null
  alt?: string | null
}

interface Issue {
  id: string
  title: string
  slug: string
  issueNumber: number
  publishDate: string
  coverArtwork?: Media | string | null
  coverImage?: Media | string | null
}

interface Section {
  id: string
  title: string
  slug: string
  order?: number
  intro?: string | null
  accentColor?: string | null
}

interface SectionIssueLookupDoc {
  issue?: string | { id?: string | null } | null
}

interface PieceAuthor {
  id?: string
  name: string
  role?: string | null
}

type PieceType = 'article' | 'poem' | 'column' | 'story' | 'snapshot'

interface Piece {
  id: string
  title: string
  slug: string
  pieceType: PieceType
  excerpt?: string | null
  publishOrder?: number
  authors: PieceAuthor[]
  leadArtwork?: Media | string | null
  section?: Section | string | null
}

interface SectionBundle {
  section: Section
  pieces: Piece[]
}

const PIECE_TYPE_LABEL: Record<PieceType, string> = {
  article: 'Article',
  poem: 'Poem',
  column: 'Column',
  story: 'Story',
  snapshot: 'Snapshot',
}

const getAuthorsLabel = (authors: PieceAuthor[] | undefined): string => {
  if (!Array.isArray(authors) || authors.length === 0) {
    return 'BSJ Staff'
  }

  return authors
    .map((author) => author.name?.trim())
    .filter(Boolean)
    .join(', ')
}

const getPiecePreviewArtwork = (piece: Piece): string | undefined => {
  return resolveR2AssetUrl(piece.leadArtwork)
}

const normalizeSectionOrder = (value: number | undefined): number => (typeof value === 'number' ? value : 999)
const normalizeSectionKey = (value: string): string => value.trim().toLowerCase()

const getSectionIssueId = (value: SectionIssueLookupDoc['issue']): string | undefined => {
  if (typeof value === 'string') {
    return value
  }

  if (value && typeof value === 'object' && typeof value.id === 'string') {
    return value.id
  }

  return undefined
}

const fetchIssueIdsWithSections = async (): Promise<Set<string> | null> => {
  try {
    const issueIds = new Set<string>()
    let page = 1
    let hasNextPage = true

    while (hasNextPage) {
      const response = await fetch(backendApiUrl(`/api/sections?limit=100&depth=0&page=${page}`))

      if (!response.ok) {
        throw new Error(`Failed to fetch section index: ${response.status}`)
      }

      const data = await response.json()
      const docs = Array.isArray(data?.docs) ? (data.docs as SectionIssueLookupDoc[]) : []

      docs.forEach((doc) => {
        const issueId = getSectionIssueId(doc.issue)

        if (issueId) {
          issueIds.add(issueId)
        }
      })

      const totalPages = typeof data?.totalPages === 'number' ? data.totalPages : page
      hasNextPage = page < totalPages
      page += 1
    }

    return issueIds
  } catch (error) {
    console.error('Failed to build section issue index:', error)
    return null
  }
}

export default function Sections() {
  const { issueId = '' } = useParams()
  const normalizedIssueId = issueId.trim().toLowerCase()

  const [issues, setIssues] = useState<Issue[]>([])
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [pieces, setPieces] = useState<Piece[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  usePageTitle(activeIssue ? `${activeIssue.title} Sections` : 'Sections')

  useEffect(() => {
    let mounted = true

    const loadSections = async () => {
      setLoading(true)
      setLoadError(null)

      try {
        const issuesResponse = await fetch(backendApiUrl('/api/bsjissues?sort=-issueNumber&limit=200&depth=1'))

        if (!issuesResponse.ok) {
          throw new Error(`Failed to fetch issues: ${issuesResponse.status}`)
        }

        const issuesData = await issuesResponse.json()
        const docs = Array.isArray(issuesData?.docs) ? (issuesData.docs as Issue[]) : []
        const issueIdsWithSections = await fetchIssueIdsWithSections()
        const visibleIssues = issueIdsWithSections
          ? docs.filter((issueDoc) => issueIdsWithSections.has(issueDoc.id))
          : docs
        const issue = matchIssueByRouteId(docs, normalizedIssueId)

        if (!mounted) return

        setIssues(sortIssuesByNewest(visibleIssues))

        if (!issue) {
          setActiveIssue(null)
          setSections([])
          setPieces([])
          setLoadError('Issue not found.')
          return
        }

        setActiveIssue(issue)

        const [sectionsResponse, piecesResponse] = await Promise.all([
          fetch(backendApiUrl(`/api/sections?where[issue][equals]=${encodeURIComponent(issue.id)}&sort=order&limit=100&depth=1`)),
          fetch(backendApiUrl(`/api/pieces?where[issue][equals]=${encodeURIComponent(issue.id)}&sort=publishOrder&limit=300&depth=2`)),
        ])

        if (!sectionsResponse.ok) {
          throw new Error(`Failed to fetch sections: ${sectionsResponse.status}`)
        }

        if (!piecesResponse.ok) {
          throw new Error(`Failed to fetch pieces: ${piecesResponse.status}`)
        }

        const sectionsData = await sectionsResponse.json()
        const piecesData = await piecesResponse.json()

        if (!mounted) return

        setSections(Array.isArray(sectionsData?.docs) ? (sectionsData.docs as Section[]) : [])
        setPieces(Array.isArray(piecesData?.docs) ? (piecesData.docs as Piece[]) : [])
      } catch (error) {
        if (mounted) {
          console.error('Failed to load section data:', error)
          setActiveIssue(null)
          setSections([])
          setPieces([])
          setLoadError('Unable to load sections right now.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadSections()

    return () => {
      mounted = false
    }
  }, [normalizedIssueId])

  const sectionBundles = useMemo<SectionBundle[]>(() => {
    const bundles = new Map<string, SectionBundle>()

    const sortedSections = [...sections].sort(
      (a, b) => normalizeSectionOrder(a.order) - normalizeSectionOrder(b.order)
    )

    const sectionLookup = new Map<string, Section>()

    sortedSections.forEach((section) => {
      sectionLookup.set(normalizeSectionKey(section.id), section)
      sectionLookup.set(normalizeSectionKey(section.slug), section)
      sectionLookup.set(normalizeSectionKey(section.title), section)
    })

    sortedSections.forEach((section) => {
      bundles.set(section.id, {
        section,
        pieces: [],
      })
    })

    pieces.forEach((piece) => {
      const pieceSection = piece.section && typeof piece.section === 'object' ? piece.section : undefined
      const stringSectionValue = typeof piece.section === 'string' ? piece.section : undefined
      const matchedStringSection = stringSectionValue ? sectionLookup.get(normalizeSectionKey(stringSectionValue)) : undefined
      const sectionId = pieceSection?.id || matchedStringSection?.id || stringSectionValue || 'uncategorized'

      if (!bundles.has(sectionId)) {
        bundles.set(sectionId, {
          section:
            pieceSection || matchedStringSection || {
              id: sectionId,
              title: 'Uncategorized',
              slug: 'uncategorized',
              order: 999,
            },
          pieces: [],
        })
      }

      bundles.get(sectionId)?.pieces.push(piece)
    })

    return [...bundles.values()]
      .map((bundle) => ({
        ...bundle,
        pieces: [...bundle.pieces].sort((a, b) => (a.publishOrder || 999) - (b.publishOrder || 999)),
      }))
      .sort((a, b) => normalizeSectionOrder(a.section.order) - normalizeSectionOrder(b.section.order))
  }, [pieces, sections])

  const activeIssueRouteId = activeIssue ? getIssueRouteId(activeIssue) : ''
  const heroCoverUrl =
    resolveR2AssetUrl(activeIssue?.coverArtwork) ||
    resolveR2AssetUrl(activeIssue?.coverImage)

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen px-4 py-16">
        <p className="text-muted-foreground">Loading issue sections...</p>
      </div>
    )
  }

  if (loadError || !activeIssue) {
    return (
      <div className="container mx-auto min-h-screen px-4 py-16">
        <h1 className="font-heading text-4xl font-black">Sections</h1>
        <p className="mt-4 text-muted-foreground">{loadError || 'No issue selected.'}</p>

        {issues.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {issues.map((issue) => (
              <Link
                key={issue.id}
                to={`/sections/${getIssueRouteId(issue)}`}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
              >
                {getIssueDisplayLabel(issue)}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top,_#2b1808_0%,_#1f1207_45%,_#101010_100%)] text-white">
        <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-[#f97316]/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

        <div className="container relative z-10 mx-auto grid items-center gap-8 px-4 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/80">
              <Palette className="h-3.5 w-3.5" />
              Issue Spread
            </div>

            <h1 className="font-heading text-4xl font-black leading-tight md:text-6xl">
              {getIssueDisplayLabel(activeIssue)}
            </h1>
            <p className="mt-3 text-lg text-white/80 md:text-2xl">
              {activeIssue.title}
            </p>
            <p className="mt-4 max-w-2xl text-white/75">
              A visual table of contents for this issue. Each piece keeps BSJ artwork central while shifting the reading experience to a web-native format.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {issues.map((issue) => {
                const routeId = getIssueRouteId(issue)
                const isCurrent = routeId === activeIssueRouteId

                return (
                  <Link
                    key={issue.id}
                    to={`/sections/${routeId}`}
                    className={cn(
                      'rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors',
                      isCurrent
                        ? 'border-white bg-white text-[#7c2d12]'
                        : 'border-white/25 text-white/75 hover:border-white hover:text-white'
                    )}
                  >
                    {getIssueDisplayLabel(issue)}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="md:col-span-5 md:justify-self-end">
            {heroCoverUrl ? (
              <div className="relative w-full max-w-[360px] overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-sm">
                <img src={heroCoverUrl} alt={activeIssue.title} className="h-auto w-full rounded-2xl object-cover" loading="lazy" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            ) : (
              <div className="w-full max-w-[360px] rounded-[1.75rem] border border-white/20 bg-white/10 p-8 text-center text-sm text-white/70">
                Cover artwork coming soon.
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 md:py-16">
        {sectionBundles.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-10 text-center">
            <h2 className="font-heading text-2xl font-black">No sections published yet</h2>
            <p className="mt-3 text-muted-foreground">
              Sections for this issue will appear here once they're published. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {sectionBundles.map(({ section, pieces }) => (
              <section key={section.id} className="rounded-3xl border border-border bg-card/40 p-6 md:p-7">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <p
                      className="mb-2 text-xs font-bold uppercase tracking-[0.2em]"
                      style={section.accentColor ? { color: section.accentColor } : undefined}
                    >
                      {section.title}
                    </p>
                    <h2 className="font-heading text-3xl font-black md:text-4xl">{section.title}</h2>
                    {section.intro ? <p className="mt-3 text-muted-foreground">{section.intro}</p> : null}
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {pieces.length} {pieces.length === 1 ? 'piece' : 'pieces'}
                  </p>
                </div>

                {pieces.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
                    <p className="text-sm text-muted-foreground">This section is published, but no pieces have been added yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pieces.map((piece) => {
                      const previewArtwork = getPiecePreviewArtwork(piece)
                      const pieceRoute = piece.slug?.trim() || piece.id
                      const isExpressive = piece.pieceType === 'poem' || piece.pieceType === 'column'

                      return (
                        <Link
                          key={piece.id}
                          to={`/sections/${activeIssueRouteId}/pieces/${encodeURIComponent(pieceRoute)}`}
                          className={cn(
                            'group overflow-hidden rounded-3xl border border-border bg-background transition-all hover:-translate-y-0.5 hover:border-[#f97316] hover:shadow-xl',
                            isExpressive && 'md:col-span-2'
                          )}
                        >
                          {previewArtwork ? (
                            <div className={cn('overflow-hidden', isExpressive ? 'max-h-[320px]' : 'max-h-[220px]')}>
                              <img
                                src={previewArtwork}
                                alt={piece.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                loading="lazy"
                              />
                            </div>
                          ) : null}

                          <div className={cn('p-5 md:p-6', isExpressive && 'md:p-8')}>
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-[#f97316]/30 bg-[#fff4e8] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b45309] dark:bg-[#2e1c12] dark:text-[#fdba74]">
                                {PIECE_TYPE_LABEL[piece.pieceType]}
                              </span>
                              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                                {getAuthorsLabel(piece.authors)}
                              </span>
                            </div>

                            <h3 className={cn('font-heading font-black leading-tight', isExpressive ? 'text-3xl md:text-4xl' : 'text-2xl')}>
                              {piece.title}
                            </h3>

                            <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#b45309] dark:text-[#fdba74]">
                              Read Piece
                              <ArrowRight className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
