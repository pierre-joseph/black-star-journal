import type { CollectionConfig } from 'payload'

const ISSUE_SECTION_OPTIONS = [
  { label: 'Columns', value: 'Columns' },
  { label: 'Art and Culture', value: 'Art and Culture' },
  { label: 'Society and News', value: 'Society and News' },
  { label: 'Local', value: 'Local' },
  { label: 'Stories', value: 'Stories' },
]

const ISSUE_SECTION_ORDER: Record<string, number> = {
  Columns: 1,
  'Art and Culture': 2,
  'Society and News': 3,
  Local: 4,
  Stories: 5,
}

const ISSUE_SECTION_SLUG: Record<string, string> = {
  Columns: 'columns',
  'Art and Culture': 'art-and-culture',
  'Society and News': 'society-and-news',
  Local: 'local',
  Stories: 'stories',
}

const normalizeSectionName = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value.trim()
  return normalized || undefined
}

export const Sections: CollectionConfig = {
  slug: 'sections',
  labels: {
    singular: 'Section',
    plural: 'Sections',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['order', 'title', 'issue', 'slug'],
  },
  fields: [
    {
      name: 'title',
      type: 'select',
      required: true,
      options: ISSUE_SECTION_OPTIONS,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      hooks: {
        beforeValidate: [
          ({ siblingData, value }) => {
            const sectionTitle = normalizeSectionName(siblingData?.title)
            return (sectionTitle && ISSUE_SECTION_SLUG[sectionTitle]) || value
          },
        ],
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'issue',
      type: 'relationship',
      relationTo: 'bsjissues',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 1,
      hooks: {
        beforeValidate: [
          ({ siblingData, value }) => {
            const sectionTitle = normalizeSectionName(siblingData?.title)
            const computedOrder = sectionTitle ? ISSUE_SECTION_ORDER[sectionTitle] : undefined
            return typeof computedOrder === 'number' ? computedOrder : value
          },
        ],
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'accentColor',
      type: 'text',
      admin: {
        description: 'Optional hex color for section labels, for example #f97316.',
      },
    },
  ],
}
