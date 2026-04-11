import type { Block } from 'payload'

export const ArtworkBlock: Block = {
  slug: 'artworkBlock',
  labels: {
    singular: 'Artwork Block',
    plural: 'Artwork Blocks',
  },
  fields: [
    {
      name: 'artwork',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'artCredit',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'placement',
      type: 'select',
      defaultValue: 'full-width',
      admin: {
        description:
          'Full width spans both columns in magazine-style articles. Other modes float in single-column pieces and render as centered insets in articles.',
      },
      options: [
        { label: 'Full width', value: 'full-width' },
        { label: 'Float left', value: 'float-left' },
        { label: 'Float right', value: 'float-right' },
        { label: 'Narrow band', value: 'inline-split' },
      ],
    },
    {
      name: 'backgroundStyle',
      type: 'select',
      defaultValue: 'paper',
      options: [
        { label: 'Paper', value: 'paper' },
        { label: 'Transparent', value: 'transparent' },
        { label: 'Muted', value: 'muted' },
      ],
    },
  ],
}
