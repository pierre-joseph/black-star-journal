import crypto from 'crypto'
import { MongoClient } from 'mongodb'

const dbUri = 'mongodb+srv://pierrejoseph_db_user:kXZnaJoC2x9JifTq@bsj-cms.vz67gjy.mongodb.net/?appName=BSJ-CMS'
const client = new MongoClient(dbUri)

async function createAdmin() {
  try {
    await client.connect()
    const db = client.db('BSJ-CMS')
    
    // Generate a simple hash for the password
    const password = 'TestAdmin123!'
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.createHash('sha256').update(password + salt).digest('hex')
    
    const user = {
      email: 'admin@blackstarjournal.com',
      password: `sha256:${hash}:${salt}`,
      name: 'Admin User', 
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('users').insertOne(user)
    
    console.log('✓ Admin user created!')
    console.log('📧 Email: admin@blackstarjournal.com')
    console.log('🔐 Password: TestAdmin123!')
    console.log('')
    console.log('🌐 Log in at: http://localhost:3001/admin')
    
    await client.close()
    process.exit(0)
  } catch (error) {
    console.error('✗ Error:', error.message)
    process.exit(1)
  } finally {
    await client.close()
  }
}

createAdmin()
