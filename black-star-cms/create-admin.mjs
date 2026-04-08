import { getPayloadHMR } from '@payloadcms/next/utilities'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config()

const payload = await getPayloadHMR({
  config: path.resolve(dirname, './src/payload.config.ts'),
})

try {
  console.log('Creating admin user...')
  
  const user = await payload.create({
    collection: 'users',
    data: {
      email: 'admin@blackstarjournal.com',
      password: 'TestAdmin123!',
      name: 'Admin User',
      role: 'admin'
    }
  })

  console.log('✓ Admin user created successfully!')
  console.log('Email: admin@blackstarjournal.com')
  console.log('Password: TestAdmin123!')
  console.log('Role: Admin')
  process.exit(0)
} catch (error) {
  console.error('✗ Error creating user:', error.message)
  if (error.message.includes('duplicate')) {
    console.log('User already exists')
  }
  process.exit(1)
}
