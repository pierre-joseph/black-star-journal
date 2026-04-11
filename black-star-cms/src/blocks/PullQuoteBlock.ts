import type { Block } from 'payload'

export const PullQuoteBlock: Block = {
  slug: 'pullQuoteBlock',
  labels: {
    singular: 'Pull Quote Block',
    plural: 'Pull Quote Blocks',
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'attribution',
      type: 'text',
    },
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'highlight',
      options: [
        { label: 'Highlight', value: 'highlight' },
        { label: 'Outline', value: 'outline' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
  ],
}
