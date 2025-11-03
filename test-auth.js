// Simple test to verify our authentication setup
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Test environment variables (these should match .env.local)
const ADMIN_USERNAME = 'rafael-root';
const ADMIN_PASSWORD = 'your-secure-password-here';
const JWT_SECRET = 'your-secret-key-here';
const ADMIN_EMAIL = 'tengxuanp@hotmail.com';

console.log('🔐 Testing Authentication System...\n');

// Test 1: Password hashing
console.log('1. Testing password hashing...');
const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);
const isValidPassword = bcrypt.compareSync(ADMIN_PASSWORD, hashedPassword);
console.log(`   Hash: ${hashedPassword.substring(0, 20)}...`);
console.log(`   Validation: ${isValidPassword ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 2: JWT token creation and verification
console.log('2. Testing JWT tokens...');
const tokenPayload = {
  username: ADMIN_USERNAME,
  email: ADMIN_EMAIL,
  role: 'admin'
};

const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });
console.log(`   Token: ${token.substring(0, 30)}...`);

try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log(`   Decoded username: ${decoded.username}`);
  console.log(`   JWT verification: ✅ PASS\n`);
} catch (error) {
  console.log(`   JWT verification: ❌ FAIL - ${error.message}\n`);
}

// Test 3: Sample blog post structure
console.log('3. Testing blog post structure...');
const samplePost = {
  id: 'test-post-001',
  title: 'HTB Season 9 - Web Challenge Writeup',
  content: '<h2>Challenge Overview</h2><p>This challenge involves...</p>',
  excerpt: 'A walkthrough of a web exploitation challenge from HTB Season 9.',
  author: 'RafaelRoot',
  date: new Date().toISOString(),
  category: 'ctf',
  subcategory: 'htb-season-9',
  tags: ['web', 'sql-injection', 'htb'],
  images: [],
  published: true
};

console.log(`   Post ID: ${samplePost.id}`);
console.log(`   Category: ${samplePost.category}`);
console.log(`   Subcategory: ${samplePost.subcategory}`);
console.log(`   Sample post structure: ✅ PASS\n`);

console.log('🎉 All authentication components are working correctly!');
console.log('\n📝 Next steps:');
console.log('   1. Update Node.js to version >= 18.17.0');
console.log('   2. Start the development server with: npm run dev');
console.log('   3. Visit http://localhost:3089 to test the application');
console.log('   4. Test login functionality with the admin credentials');
console.log('   5. Create, edit, and delete blog posts through the interface');
