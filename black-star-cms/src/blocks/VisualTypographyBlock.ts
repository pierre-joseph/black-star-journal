import type { Block } from 'payload'

export const VisualTypographyBlock: Block = {
  slug: 'visualTypographyBlock',
  labels: {
    singular: 'Visual Typography Block',
    plural: 'Visual Typography Blocks',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'spaced',
      options: [
        { label: 'Spaced Letters', value: 'spaced' },
        { label: 'Stacked', value: 'stacked' },
        { label: 'Impact', value: 'impact' },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'textColor',
      type: 'text',
      admin: {
        description: 'Optional CSS color value, for example #b45309.',
      },
    },
  ],
}
