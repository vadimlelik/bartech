import bcrypt from 'bcryptjs';

const ROUNDS = 12;

export async function hashPassword(plain) {
  return bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(plain, passwordHash) {
  if (!plain || !passwordHash) return false;
  return bcrypt.compare(plain, passwordHash);
}
