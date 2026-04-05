import { MongoClient } from 'mongodb'

const dbUri = 'mongodb+srv://pierrejoseph_db_user:kXZnaJoC2x9JifTq@bsj-cms.vz67gjy.mongodb.net/?appName=BSJ-CMS'
const client = new MongoClient(dbUri)

async function updateAdminEmail() {
  try {
    await client.connect()
    const db = client.db('BSJ-CMS')
    
    const result = await db.collection('users').updateOne(
      { email: 'admin@blackstarjournal.com' },
      { $set: { email: 'blackstarjournal@brown.edu' } }
    )
    
    if (result.matchedCount === 0) {
      console.log('⚠️  User not found')
    } else {
      console.log('✓ Email updated!')
      console.log('📧 New Email: blackstarjournal@brown.edu')
      console.log('🔐 Password: TestAdmin123!')
      console.log('')
      console.log('🌐 Log in at: http://localhost:3001/admin')
    }
    
    await client.close()
    process.exit(0)
  } catch (error) {
    console.error('✗ Error:', error.message)
    process.exit(1)
  }
}

updateAdminEmail()
