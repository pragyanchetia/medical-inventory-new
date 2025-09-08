import { PrismaClient } from '@prisma/client';
import path from 'path';

declare global {
  var prisma: PrismaClient | undefined;
}
 
const dbPath = `file:${path.resolve(__dirname, "..", 'prisma', 'dev.db')}` 

console.log('Database Path:', dbPath);

export const prisma = globalThis.prisma || new PrismaClient({
  datasources: {
    db: {
      url: dbPath,
    },
  },
});
 
globalThis.prisma = prisma;
