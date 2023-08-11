import { sign } from 'jsonwebtoken';

export const generateToken = (data: object, secret: string, expiresIn: number) => {
  return sign(data, secret, { expiresIn });
}