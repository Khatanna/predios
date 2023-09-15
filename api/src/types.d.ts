import { BaseContext } from '@apollo/server';
import type { User, Permission, Status, PrismaClient, Prisma } from '@prisma/client';

type UserContext = {
  userContext?: User & { permissions: { status: Status, permission: Pick<Permission, 'resource' | 'level' | 'status'> }[] }
}

type PrismaContext = {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}

export type Context = BaseContext & UserContext & PrismaContext