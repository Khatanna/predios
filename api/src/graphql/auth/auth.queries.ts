import { PrismaClient } from "@prisma/client"
import { GraphQLError } from "graphql";
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken'
const prisma = new PrismaClient();

export const login = async (_: any, data: { username: string, password: string }) => {
  const { username, password } = data;
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      password: true,
    }
  })

  if (user) {
    if (Boolean(user.username.localeCompare(username)) || Boolean(user.password.localeCompare(password))) {
      throw new Error('Las credenciales son incorrectas')
    }
    const accessToken = sign({ id: user.id, username }, 'my-secret', { expiresIn: 60 });
    const refreshToken = sign({ id: user.id }, 'secret-refresh-token', { expiresIn: 60 * 60 })

    return { accessToken, refreshToken };
  }

  throw Error('Las credenciales son incorrectas');
}

export const isAuth = async (_: any, data: { id: string; token: string }) => {
  try {
    const { id, token } = data;

    const user = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        username: true,
      }
    })

    const verifyToken = verify(token, 'my-secret')
    return JSON.stringify(user) === JSON.stringify(verifyToken);
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      throw Error('Token incorrecto e invalido')
    }
    throw Error((e as GraphQLError).message)
  }
}

export const getNewAccessToken = async (_: any, data: { refreshToken: string }) => {
  try {
    const { refreshToken } = data;
    const verifyToken = verify(refreshToken, 'secret-refresh-token')

    console.log(verifyToken);

    return verifyToken
  } catch (e) {
    console.log(e)
    throw Error('token invalido')
  }
}