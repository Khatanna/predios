import { PrismaClient } from "@prisma/client"
import { sign } from 'jsonwebtoken'
const prisma = new PrismaClient();

export const login = async (_: any, data: any) => {
  const { username, password } = data;

  const user = await prisma.user.findUnique({
    where: {
      username,
      AND: {
        password,
      }
    }
  })

  if (user) {
    const token = sign(JSON.stringify({ id: user.id, username: user.username }), 'my-secret');
    
    return {user, token};
  }

  return user;
}