import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'

// Charger les variables d'environnement depuis .env.local
config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Vérifier si un super admin existe déjà
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: 'admin@cozetik.com',
    },
  })

  if (existingAdmin) {
    console.log('✅ Super admin already exists')
    return
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash('Admin123!', 10)

  // Créer le super admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@cozetik.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })

  console.log('✅ Super admin created:', admin.email)
  console.log('📧 Email: admin@cozetik.com')
  console.log('🔑 Password: Admin123!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
