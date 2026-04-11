import { BlocksFeature, FixedToolbarFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

import { ArtworkBlock } from '../blocks/ArtworkBlock'
import { PullQuoteBlock } from '../blocks/PullQuoteBlock'
import { VisualTypographyBlock } from '../blocks/VisualTypographyBlock'

const normalizeText = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value.trim().toLowerCase()
  return normalized || undefined
}

const resolveRelationshipId = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || undefined
  }

  if (!value || typeof value !== 'object') {
    return undefined
  }

  const record = value as {
    id?: unknown
    value?: unknown
  }

  return resolveRelationshipId(record.id) ?? resolveRelationshipId(record.value)
}

const pieceBodyEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    FixedToolbarFeature(),
    InlineToolbarFeature(),
    BlocksFeature({
      blocks: [ArtworkBlock, PullQuoteBlock, VisualTypographyBlock],
    }),
  ],
})

export const Pieces: CollectionConfig = {
  slug: 'pieces',
  labels: {
    singular: 'Piece',
    plural: 'Pieces',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['publishOrder', 'title', 'pieceType', 'section', 'issue'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      hooks: {
        beforeValidate: [
          ({ value }) => normalizeText(value) ?? value,
        ],
      },
      validate: async (value: unknown, options: any) => {
        const req = options?.req
        const siblingData = options?.siblingData as { issue?: unknown } | undefined
        const id = options?.id as string | undefined

        const slugValue = normalizeText(value)
        if (!slugValue) {
          return 'Slug is required.'
        }

        const issueId = resolveRelationshipId(siblingData?.issue)

        if (!req?.payload || !issueId) {
          return true
        }

        const existing = await req.payload.find({
          collection: 'pieces',
          where: {
            and: [
              {
                issue: {
                  equals: issueId,
                },
              },
              {
                slug: {
                  equals: slugValue,
                },
              },
            ],
          },
          depth: 0,
          limit: 2,
          pagination: false,
        })

        const duplicate = existing.docs
          .map((doc: unknown) => doc as { id?: string })
          .find((doc: { id?: string }) => !id || doc.id !== id)

        return duplicate ? 'Slug must be unique within the selected issue.' : true
      },
    },
    {
      name: 'issue',
      type: 'relationship',
      relationTo: 'bsjissues',
      required: true,
    },
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'sections',
      required: true,
      admin: {
        description: 'Select an issue first to filter section options correctly.',
      },
      filterOptions: (options: any) => {
        const siblingData = options?.siblingData as { issue?: unknown } | undefined
        const issueId = resolveRelationshipId(siblingData?.issue)

        if (!issueId) {
          return false
        }

        return {
          issue: {
            equals: issueId,
          },
        }
      },
      validate: async (value: unknown, options: any) => {
        const req = options?.req
        const siblingData = options?.siblingData as { issue?: unknown } | undefined
        const sectionId = resolveRelationshipId(value)
        const issueId = resolveRelationshipId(siblingData?.issue)

        if (!sectionId || !issueId || !req?.payload) {
          return true
        }

        try {
          const section = await req.payload.findByID({
            collection: 'sections',
            id: sectionId,
            depth: 0,
          })

          const sectionIssueId = resolveRelationshipId((section as { issue?: unknown }).issue)
          return sectionIssueId === issueId ? true : 'Selected section must belong to the selected issue.'
        } catch {
          return 'Selected section is invalid.'
        }
      },
    },
    {
      name: 'pieceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Article', value: 'article' },
        { label: 'Poem', value: 'poem' },
        { label: 'Column', value: 'column' },
        { label: 'Story', value: 'story' },
        { label: 'Snapshot', value: 'snapshot' },
      ],
    },
    {
      name: 'publishOrder',
      type: 'number',
      required: true,
      defaultValue: 1,
    },
    {
      name: 'authors',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
        },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'leadArtwork',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hero artwork shown at the top of the piece reading view.',
      },
    },
    {
      name: 'artCredit',
      type: 'text',
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      editor: pieceBodyEditor,
      admin: {
        description: 'Use the + menu to insert Artwork Blocks between stanzas for custom poem layouts.',
      },
    },
  ],
}
