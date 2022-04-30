import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const date = new Date();

async function hashIt(password): Promise<string> {
  const salt = await bcrypt.genSalt(6);
  const hashed: string = await bcrypt.hash(password, salt);
  try {
    return hashed;
  } catch {
    console.error(hashed);
  }
}

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      password: await hashIt('password'),
      tasks: {
        create: {
          title: 'Check out Prisma with Next.js',
          actionTime: date,
          createdTime: date,
          updatedTime: date,
          objectives: {
            create: [
              {
                objectiveName: 'Open Next.js documentation',
                isFinished: null,
                createdTime: new Date(date.setHours(date.getHours() + 4)),
                updatedTime: new Date(date.setHours(date.getHours() + 4)),
              },
              {
                objectiveName: 'Open Prisma section',
                isFinished: null,
                createdTime: new Date(date.setHours(date.getHours() + 5)),
                updatedTime: new Date(date.setHours(date.getHours() + 5)),
              },
            ],
          },
        },
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      password: await hashIt('password'),
      tasks: {
        create: [
          {
            title: 'Follow Prisma on Twitter',
            actionTime: date,
            createdTime: date,
            updatedTime: date,
            objectives: {
              create: [
                {
                  objectiveName: 'Open Twitter',
                  isFinished: null,
                  createdTime: new Date(date.setHours(date.getHours() + 4)),
                  updatedTime: new Date(date.setHours(date.getHours() + 4)),
                },
                {
                  objectiveName: 'Open Prisma Account',
                  isFinished: null,
                  createdTime: new Date(date.setHours(date.getHours() + 5)),
                  updatedTime: new Date(date.setHours(date.getHours() + 5)),
                },
                {
                  objectiveName: 'Follow Prisma Account',
                  isFinished: null,
                  createdTime: new Date(date.setHours(date.getHours() + 6)),
                  updatedTime: new Date(date.setHours(date.getHours() + 6)),
                },
              ],
            },
          },
          {
            title: 'Checkout Pharindo',
            actionTime: date,
            createdTime: date,
            updatedTime: date,
            objectives: {
              create: [
                {
                  objectiveName: 'Open Google',
                  isFinished: null,
                  createdTime: new Date(date.setHours(date.getHours() + 4)),
                  updatedTime: new Date(date.setHours(date.getHours() + 4)),
                },
                {
                  objectiveName: 'Search Pharindo',
                  isFinished: null,
                  createdTime: new Date(date.setHours(date.getHours() + 5)),
                  updatedTime: new Date(date.setHours(date.getHours() + 5)),
                },
                {
                  objectiveName: 'Find info in Pharos Website',
                  isFinished: null,
                  createdTime: new Date(date.setHours(date.getHours() + 6)),
                  updatedTime: new Date(date.setHours(date.getHours() + 6)),
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log({ alice, bob });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
