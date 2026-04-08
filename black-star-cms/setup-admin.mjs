import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const dbUri = 'mongodb+srv://pierrejoseph_db_user:kXZnaJoC2x9JifTq@bsj-cms.vz67gjy.mongodb.net/?appName=BSJ-CMS'

async function createAdmin() {
  try {
    await mongoose.connect(dbUri)
    const db = mongoose.connection.db

    const hashedPassword = await bcrypt.hash('TestAdmin123!', 10)

    const result = await db.collection('users').insertOne({
      email: 'admin@blackstarjournal.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log('✓ Admin user created!')
    console.log('Email: admin@blackstarjournal.com')
    console.log('Password: TestAdmin123!')
    console.log('')
    console.log('You can now log in at: http://localhost:3001/admin')
    
    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    if (error.message.includes('duplicate')) {
      console.log('ℹ User already exists')
      console.log('Email: admin@blackstarjournal.com')
      console.log('Password: TestAdmin123!')
    } else {
      console.error('✗ Error:', error.message)
    }
    process.exit(1)
  }
}

createAdmin()
