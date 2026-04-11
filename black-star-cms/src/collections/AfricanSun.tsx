import type { CollectionConfig } from 'payload'

export const AfricanSun: CollectionConfig = {
  slug: 'africansun',
  dbName: 'africansunpublications',
  labels: {
    singular: 'African Sun Publication',
    plural: 'African Sun Publications',
  },
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
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'publishDate',
      type: 'date',
      required: true,
    },
    {
      name: 'fullPdf',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    }
  ],
}
