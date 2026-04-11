import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'assetType',
      type: 'select',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Cover Artwork', value: 'cover-artwork' },
        { label: 'Inline Artwork', value: 'inline-artwork' },
        { label: 'Illustration', value: 'illustration' },
      ],
      defaultValue: 'general',
    },
    {
      name: 'artistName',
      type: 'text',
      admin: {
        description: 'Artist credit, for example Marie Auguste or Jessie Owusu.',
      },
    },
    {
      name: 'sourceIssue',
      type: 'relationship',
      relationTo: 'bsjissues',
      admin: {
        description: 'Attach media to the BSJ issue where this artwork appears.',
      },
    },
    {
      name: 'page',
      type: 'number',
      admin: {
        description: 'Page number to navigate to in PDF',
      },
    },
  ],
}
