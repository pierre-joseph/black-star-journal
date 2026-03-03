import type { CollectionConfig } from 'payload'

export const Issues: CollectionConfig = {
  slug: 'bsjissues',
  dbName: 'issues', // keep existing MongoDB collection — no data migration needed
  labels: {
    singular: 'BSJ Issue',
    plural: 'BSJ Issues',
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
      name: 'issueNumber',
      type: 'number',
      required: true,
      unique: true,
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
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'articles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
    },
  ],
}
