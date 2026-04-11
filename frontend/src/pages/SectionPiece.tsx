import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpenText } from 'lucide-react'

import { PieceBodyRenderer } from '@/components/PieceBodyRenderer'
import { usePageTitle } from '@/hooks/usePageTitle'
import { backendApiUrl, resolveR2AssetUrl } from '@/lib/api'
import { getIssueDisplayLabel, getIssueRouteId, matchIssueByRouteId } from '@/lib/issueRouting'
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
  accentColor?: string | null
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
  body?: unknown
  leadArtwork?: Media | string | null
  artCredit?: string | null
  authors: PieceAuthor[]
  section?: Section | string | null
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

const getReadingSurfaceClass = (pieceType: PieceType): string => {
  switch (pieceType) {
    case 'article':
      return 'rounded-[2rem] border border-[#f0d9b8] bg-[#fffaef] p-6 shadow-2xl md:p-10 dark:border-stone-700 dark:bg-stone-900/70'
    case 'poem':
      return 'rounded-[2rem] border border-[#bfd5ff] bg-gradient-to-br from-[#f8fbff] via-[#edf3ff] to-[#f9f3ff] p-6 shadow-2xl md:p-12 dark:border-sky-900/70 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/70'
    case 'column':
      return 'rounded-[2rem] border border-[#f2d9be] bg-gradient-to-b from-[#fff6e8] to-[#fff0de] p-6 md:p-10 dark:border-stone-700 dark:from-stone-900 dark:to-stone-950'
    case 'story':
      return 'rounded-[2rem] border border-[#f5d7b2] bg-[#fff9ef] p-6 shadow-2xl md:p-10 dark:border-stone-700 dark:bg-stone-900/60'
    case 'snapshot':
      return 'rounded-[2rem] border border-zinc-300 bg-gradient-to-b from-white to-zinc-100 p-5 md:p-8 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-950'
    default:
      return ''
  }
}

const getReadingWidthClass = (pieceType: PieceType): string => {
  switch (pieceType) {
    case 'article':
      return 'max-w-6xl'
    case 'poem':
      return 'max-w-4xl'
    case 'column':
      return 'max-w-5xl'
    case 'story':
      return 'max-w-4xl'
    case 'snapshot':
      return 'max-w-3xl'
    default:
      return 'max-w-6xl'
  }
}

export default function SectionPiece() {
  const { issueId = '', pieceSlug = '' } = useParams()
  const normalizedIssueId = issueId.trim().toLowerCase()
  const normalizedPieceSlug = pieceSlug.trim().toLowerCase()

  const [issue, setIssue] = useState<Issue | null>(null)
  const [piece, setPiece] = useState<Piece | null>(null)
  const [loading, setLoading] = useState(true)

  usePageTitle(piece?.title ?? (loading ? 'Loading Piece...' : 'Piece Not Found'))

  useEffect(() => {
    let mounted = true

    const loadPiece = async () => {
      setLoading(true)

      try {
        const issuesResponse = await fetch(backendApiUrl('/api/bsjissues?sort=-issueNumber&limit=200&depth=1'))

        if (!issuesResponse.ok) {
          throw new Error(`Failed to fetch issues: ${issuesResponse.status}`)
        }

        const issuesData = await issuesResponse.json()
        const issues = Array.isArray(issuesData?.docs) ? (issuesData.docs as Issue[]) : []
        const matchedIssue = matchIssueByRouteId(issues, normalizedIssueId)

        if (!mounted) return

        if (!matchedIssue) {
          setIssue(null)
          setPiece(null)
          return
        }

        setIssue(matchedIssue)

        const piecesResponse = await fetch(
          backendApiUrl(`/api/pieces?where[issue][equals]=${encodeURIComponent(matchedIssue.id)}&sort=publishOrder&limit=300&depth=3`)
        )

        if (!piecesResponse.ok) {
          throw new Error(`Failed to fetch pieces: ${piecesResponse.status}`)
        }

        const piecesData = await piecesResponse.json()
        const docs = Array.isArray(piecesData?.docs) ? (piecesData.docs as Piece[]) : []

        const matchedPiece = docs.find((candidate) => {
          const slugMatch = candidate.slug?.toLowerCase() === normalizedPieceSlug
          const idMatch = candidate.id?.toLowerCase() === normalizedPieceSlug
          return slugMatch || idMatch
        })

        if (!mounted) return
        setPiece(matchedPiece ?? null)
      } catch (error) {
        if (mounted) {
          console.error('Failed to load piece data:', error)
          setIssue(null)
          setPiece(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadPiece()

    return () => {
      mounted = false
    }
  }, [normalizedIssueId, normalizedPieceSlug])

  const issueRouteId = issue ? getIssueRouteId(issue) : 'sections'

  const leadArtworkUrl = useMemo(() => {
    if (!piece) return undefined
    return resolveR2AssetUrl(piece.leadArtwork)
  }, [piece])

  const issueLabel = issue ? getIssueDisplayLabel(issue) : 'Issue'
  const authorsLabel = getAuthorsLabel(piece?.authors)
  const section = piece?.section && typeof piece.section === 'object' ? piece.section : undefined

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen px-4 py-16">
        <p className="text-muted-foreground">Loading piece...</p>
      </div>
    )
  }

  if (!issue || !piece) {
    return (
      <div className="container mx-auto min-h-screen px-4 py-16">
        <Link to="/sections" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
          <ArrowLeft className="h-4 w-4" />
          Back to sections
        </Link>
        <h1 className="mt-6 font-heading text-4xl font-black">Piece not found</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          This piece may be unpublished, moved, or linked with an outdated URL.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top,_#2b1808_0%,_#130f0c_48%,_#080808_100%)] text-white">
        <div className="absolute -left-20 top-8 h-52 w-52 rounded-full bg-[#f97316]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        <div className="container relative z-10 mx-auto px-4 py-12 md:py-16">
          <Link
            to={`/sections/${issueRouteId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {issueLabel}
          </Link>

          <div className="mt-6 max-w-4xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/80">
              <BookOpenText className="h-3.5 w-3.5" />
              {PIECE_TYPE_LABEL[piece.pieceType]}
            </div>
            <h1 className="font-heading text-4xl font-black leading-tight md:text-6xl">{piece.title}</h1>
            <p className="mt-3 text-sm uppercase tracking-[0.18em] text-white/70">{authorsLabel}</p>
            <p className="mt-3 max-w-2xl text-white/80">
              {piece.excerpt || issue.title}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-white/65">
              <span className="rounded-full border border-white/20 px-3 py-1">{issueLabel}</span>
              {section ? (
                <span className="rounded-full border border-white/20 px-3 py-1" style={section.accentColor ? { borderColor: section.accentColor, color: section.accentColor } : undefined}>
                  {section.title}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {piece.pieceType === 'poem' && leadArtworkUrl ? (
          <section aria-label="Poem illustrations" className="mx-auto mb-14 max-w-3xl space-y-10">
            <figure className="overflow-hidden rounded-[1.75rem] border border-[#c7d7f5]/80 bg-gradient-to-b from-[#f8faff] to-[#eef3ff] p-5 shadow-xl dark:border-slate-600/80 dark:from-slate-900 dark:to-slate-950">
              <img
                src={leadArtworkUrl}
                alt={piece.title}
                className="mx-auto h-auto max-h-[min(78vh,880px)] w-full object-contain"
                loading="lazy"
              />
              {piece.artCredit ? (
                <figcaption className="mt-4 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {piece.artCredit}
                </figcaption>
              ) : null}
            </figure>
          </section>
        ) : null}

        {piece.pieceType === 'poem' ? (
          <article className={cn('mx-auto', getReadingWidthClass(piece.pieceType), getReadingSurfaceClass(piece.pieceType))}>
            <PieceBodyRenderer body={piece.body} pieceType={piece.pieceType} />
          </article>
        ) : leadArtworkUrl ? (
          <article
            className={cn(
              'mx-auto overflow-hidden shadow-2xl',
              getReadingWidthClass(piece.pieceType),
              getReadingSurfaceClass(piece.pieceType),
              'p-0'
            )}
          >
            <figure className="border-b border-[#f0d9b8]/70 bg-gradient-to-b from-[#fff7ec] to-[#fffaef] p-5 md:p-8 dark:border-stone-700 dark:from-stone-950 dark:to-stone-900/80">
              <img
                src={leadArtworkUrl}
                alt={piece.title}
                className="mx-auto h-auto max-h-[min(70vh,640px)] w-full max-w-4xl object-contain"
                loading="lazy"
              />
              {piece.artCredit ? (
                <figcaption className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Art credit: {piece.artCredit}
                </figcaption>
              ) : null}
            </figure>
            <div className="p-6 md:p-10">
              <PieceBodyRenderer body={piece.body} pieceType={piece.pieceType} />
            </div>
          </article>
        ) : (
          <article className={cn('mx-auto', getReadingWidthClass(piece.pieceType), getReadingSurfaceClass(piece.pieceType))}>
            <PieceBodyRenderer body={piece.body} pieceType={piece.pieceType} />
          </article>
        )}

      </main>
    </div>
  )
}
