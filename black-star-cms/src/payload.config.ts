import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Issues } from './collections/Issues'
import { Articles } from './collections/Articles'
import { AfricanSun } from './collections/AfricanSun'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Define your URLs dynamically
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const frontendURL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:5000'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  
  // Use the dynamic variable here
  serverURL: serverURL,

  // Update CORS and CSRF to trust both your local and production URLs
  cors: [
    frontendURL,
    serverURL,
  ],

  csrf: [
    frontendURL,
    serverURL,
  ],
  
  collections: [Users, Media, Issues, Articles, AfricanSun],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [],
})