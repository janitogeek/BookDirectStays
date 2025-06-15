import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Generate JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('\nJWT_SECRET:');
console.log(jwtSecret);

// Generate password hash
const password = 'BookDirectStays2024!'; // A secure password with uppercase, lowercase, numbers, and special characters
bcrypt.hash(password, 10).then(hash => {
  console.log('\nADMIN_PASSWORD_HASH:');
  console.log(hash);
  console.log('\nAdmin Password (save this somewhere safe):');
  console.log(password);
}); 