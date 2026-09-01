import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.log('Usage: npm run hash <password>');
  console.log('Example: npm run hash "MySecurePass2026!"');
  process.exit(1);
}

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('\n=========================================');
console.log('🔐 Password Hashing Utility (bcryptjs)');
console.log('=========================================');
console.log('Original Password:', password);
console.log('Bcrypt Hash:      ', hash);
console.log('\nThêm vào tệp .env:');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log('=========================================\n');
