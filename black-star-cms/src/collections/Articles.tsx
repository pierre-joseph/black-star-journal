import type { CollectionConfig } from 'payload'

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

export const Articles: CollectionConfig = {
  slug: 'articles',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'issue',
      type: 'relationship',
      relationTo: 'bsjissues',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'section',
      type: 'relationship',
      required: true,
      relationTo: 'sections',
      admin: {
        description: 'Select an issue first to filter section options correctly.',
      },
      filterOptions: (options: any) => {
        const data = (options?.siblingData ?? {}) as {
          issue?: unknown
        }

        const issueId = resolveRelationshipId(data.issue)

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
        const siblingData = options?.siblingData
        const sectionId = resolveRelationshipId(value)
        const data = (siblingData ?? {}) as {
          issue?: unknown
        }
        const issueId = resolveRelationshipId(data.issue)

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
      name: 'publishDate',
      type: 'date',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
