import { Fragment, type ReactNode } from 'react'

import { resolveR2AssetUrl } from '@/lib/api'
import { cn } from '@/lib/utils'

type PieceType = 'article' | 'poem' | 'column' | 'story' | 'snapshot'

type LexicalNode = {
  type?: string
  text?: string
  format?: number
  tag?: string
  listType?: string
  url?: string
  fields?: Record<string, unknown>
  blockType?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

interface PieceBodyRendererProps {
  body: unknown
  pieceType: PieceType
  className?: string
}

const TEXT_FORMAT = {
  bold: 1,
  italic: 2,
  strikethrough: 4,
  underline: 8,
  code: 16,
  subscript: 32,
  superscript: 64,
}

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

const asNodes = (value: unknown): LexicalNode[] => (Array.isArray(value) ? (value as LexicalNode[]) : [])

const asString = (value: unknown): string | undefined => (typeof value === 'string' ? value : undefined)

const hasFormat = (format: unknown, mask: number): boolean =>
  typeof format === 'number' && (format & mask) !== 0

const getPieceBodyClass = (pieceType: PieceType): string => {
  switch (pieceType) {
    case 'article':
      return 'piece-body piece-body-article'
    case 'poem':
      return 'piece-body piece-body-poem'
    case 'column':
      return 'piece-body piece-body-column'
    case 'story':
      return 'piece-body piece-body-story'
    case 'snapshot':
      return 'piece-body piece-body-snapshot'
    default:
      return 'piece-body'
  }
}

const renderTextNode = (node: LexicalNode, key: string): ReactNode => {
  const text = node.text || ''

  const chunks = text.split('\n')
  const chunked = chunks.map((chunk, index) => (
    <Fragment key={`${key}-chunk-${index}`}>
      {chunk}
      {index < chunks.length - 1 ? <br /> : null}
    </Fragment>
  ))

  let content: ReactNode = chunked

  if (hasFormat(node.format, TEXT_FORMAT.code)) {
    content = <code className="rounded bg-stone-200 px-1 py-0.5 text-sm dark:bg-stone-800">{content}</code>
  }

  if (hasFormat(node.format, TEXT_FORMAT.bold)) {
    content = <strong>{content}</strong>
  }

  if (hasFormat(node.format, TEXT_FORMAT.italic)) {
    content = <em>{content}</em>
  }

  if (hasFormat(node.format, TEXT_FORMAT.underline)) {
    content = <span className="underline underline-offset-2">{content}</span>
  }

  if (hasFormat(node.format, TEXT_FORMAT.strikethrough)) {
    content = <span className="line-through">{content}</span>
  }

  if (hasFormat(node.format, TEXT_FORMAT.subscript)) {
    content = <sub>{content}</sub>
  }

  if (hasFormat(node.format, TEXT_FORMAT.superscript)) {
    content = <sup>{content}</sup>
  }

  return <span key={key}>{content}</span>
}

const renderCustomBlock = (node: LexicalNode, key: string, pieceType: PieceType): ReactNode => {
  const fields = asRecord(node.fields)
  const blockType = asString(fields.blockType) || asString(node.blockType)

  if (blockType === 'artworkBlock') {
    const artwork = fields.artwork
    const artCredit = asString(fields.artCredit)
    const caption = asString(fields.caption)
    const placement = asString(fields.placement) || 'full-width'
    const backgroundStyle = asString(fields.backgroundStyle) || 'paper'

    const artworkUrl = resolveR2AssetUrl(artwork as string | { filename?: string | null; url?: string | null } | null)

    if (!artworkUrl) {
      return null
    }

    const isArticleColumns = pieceType === 'article'
    const useEditorialInset =
      isArticleColumns && (placement === 'float-left' || placement === 'float-right' || placement === 'inline-split')

    return (
      <figure
        key={key}
        className={cn(
          'piece-block-break piece-artwork-figure my-8 overflow-hidden rounded-2xl',
          isArticleColumns && 'piece-artwork-span',
          backgroundStyle === 'transparent' ? 'bg-transparent p-0' : 'p-4 md:p-6',
          backgroundStyle === 'paper' && 'bg-[#fdf6ea] dark:bg-stone-900',
          backgroundStyle === 'muted' && 'bg-muted/40',
          !useEditorialInset && placement === 'float-left' && 'md:float-left md:mr-8 md:w-[44%]',
          !useEditorialInset && placement === 'float-right' && 'md:float-right md:ml-8 md:w-[44%]',
          !useEditorialInset && placement === 'inline-split' && 'md:w-[62%]',
          useEditorialInset && 'mx-auto w-full max-w-xl border border-[#f0d9b8]/80 shadow-lg dark:border-stone-600/80'
        )}
      >
        <img src={artworkUrl} alt={caption || artCredit || 'Artwork'} className="h-auto w-full object-contain" loading="lazy" />
        {(caption || artCredit) && (
          <figcaption className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {caption}
            {caption && artCredit ? ' · ' : ''}
            {artCredit}
          </figcaption>
        )}
      </figure>
    )
  }

  if (blockType === 'pullQuoteBlock') {
    const quote = asString(fields.quote)
    const attribution = asString(fields.attribution)
    const tone = asString(fields.tone) || 'highlight'

    if (!quote) {
      return null
    }

    return (
      <blockquote
        key={key}
        className={cn(
          'piece-block-break my-10 rounded-2xl px-6 py-6 text-balance font-heading text-2xl leading-tight md:px-8 md:text-3xl',
          tone === 'highlight' && 'bg-[#f97316] text-white',
          tone === 'outline' && 'border-2 border-[#f97316] bg-transparent text-[#7c2d12] dark:text-[#fdba74]',
          tone === 'minimal' && 'border-l-4 border-[#f97316] bg-transparent pl-5 text-foreground'
        )}
      >
        <p>“{quote}”</p>
        {attribution ? (
          <cite className="mt-3 block text-sm uppercase tracking-[0.2em] not-italic opacity-80">{attribution}</cite>
        ) : null}
      </blockquote>
    )
  }

  if (blockType === 'visualTypographyBlock') {
    const text = asString(fields.text)
    const variant = asString(fields.variant) || 'spaced'
    const alignment = asString(fields.alignment) || 'center'
    const textColor = asString(fields.textColor)

    if (!text) {
      return null
    }

    const displayText = variant === 'spaced' ? text.split('').join(' ') : text
    const alignmentClass =
      alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'

    return (
      <div
        key={key}
        className={cn(
          'piece-block-break my-10 font-heading font-black uppercase',
          alignmentClass,
          variant === 'impact' && 'text-4xl leading-none md:text-6xl',
          variant === 'stacked' && 'text-3xl leading-[1.1] md:text-5xl',
          variant === 'spaced' && 'text-2xl tracking-[0.42em] md:text-3xl'
        )}
        style={textColor ? { color: textColor } : undefined}
      >
        {variant === 'stacked' ? <span className="whitespace-pre-line">{text.split(' ').join('\n')}</span> : displayText}
      </div>
    )
  }

  return null
}

const renderNodes = (nodes: LexicalNode[], keyPrefix: string, pieceType: PieceType): ReactNode[] =>
  nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`
    const children = asNodes(node.children)

    switch (node.type) {
      case 'text':
        return renderTextNode(node, key)
      case 'linebreak':
        return <br key={key} />
      case 'paragraph':
        return (
          <p key={key}>
            {children.length > 0 ? renderNodes(children, key, pieceType) : null}
          </p>
        )
      case 'heading': {
        const headingTag =
          node.tag === 'h1' ||
          node.tag === 'h2' ||
          node.tag === 'h3' ||
          node.tag === 'h4' ||
          node.tag === 'h5' ||
          node.tag === 'h6'
            ? node.tag
            : 'h2'
        const HeadingTag = headingTag

        return (
          <HeadingTag key={key} className="piece-block-break">
            {renderNodes(children, key, pieceType)}
          </HeadingTag>
        )
      }
      case 'quote':
        return (
          <blockquote key={key} className="piece-block-break">
            {renderNodes(children, key, pieceType)}
          </blockquote>
        )
      case 'list': {
        const ListTag = node.listType === 'number' ? 'ol' : 'ul'
        return (
          <ListTag key={key} className="piece-block-break">
            {renderNodes(children, key, pieceType)}
          </ListTag>
        )
      }
      case 'listitem':
        return <li key={key}>{renderNodes(children, key, pieceType)}</li>
      case 'link': {
        const url = asString(node.url) || '#'
        return (
          <a key={key} href={url} target={url.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
            {renderNodes(children, key, pieceType)}
          </a>
        )
      }
      case 'block':
        return <Fragment key={key}>{renderCustomBlock(node, key, pieceType)}</Fragment>
      default:
        return <Fragment key={key}>{children.length > 0 ? renderNodes(children, key, pieceType) : null}</Fragment>
    }
  })

export function PieceBodyRenderer({ body, pieceType, className }: PieceBodyRendererProps) {
  const root = asRecord(body)
  const rootNode = asRecord(root.root)
  const children = asNodes(rootNode.children)

  if (!children.length) {
    return <p className="text-muted-foreground">No body content has been published for this piece yet.</p>
  }

  return <div className={cn(getPieceBodyClass(pieceType), className)}>{renderNodes(children, 'root', pieceType)}</div>
}
