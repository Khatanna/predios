import { BaseContext } from '@apollo/server';
import type { User, Permission, Status, PrismaClient, Prisma, Role } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions'
type UserContext = {
  userContext?: User & { role: Role & { permissions: Array<{ status: string, permission: Permission }> } }
}

type PrismaContext = {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}

export type PubSubContext = {
  pubSub: PubSub
}

export type Context = BaseContext & UserContext & PrismaContext & PubSubContext