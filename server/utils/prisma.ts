import { PrismaClient } from "@prisma/client";
import { logger } from "./log-files";

const prismaI = new PrismaClient();
logger.info('utils - prisma.ts - create prisma client');

export default prismaI;

