import bcrypt from 'bcryptjs';

export const verifyPassword = (password: string, userPassword: string) => {
  return bcrypt.compareSync(password, userPassword)
}