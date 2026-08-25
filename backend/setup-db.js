#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up database...');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('✓ DATABASE_URL found');

// Read SQL file
const sqlFile = path.join(__dirname, 'prisma', 'init.sql');
if (!fs.existsSync(sqlFile)) {
  console.error('❌ ERROR: init.sql not found');
  process.exit(1);
}

const sql = fs.readFileSync(sqlFile, 'utf8');
console.log('✓ SQL file loaded');

// Execute SQL using Prisma
try {
  console.log('📊 Creating database tables...');
  
  // Use Prisma CLI to execute raw SQL
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  (async () => {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log('✅ Database tables created successfully!');
      
      // Generate Prisma client
      console.log('🔄 Generating Prisma client...');
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('✅ Prisma client generated!');
      
      await prisma.$disconnect();
      console.log('🎉 Database setup complete!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Database setup failed:', error.message);
      await prisma.$disconnect();
      process.exit(1);
    }
  })();
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
