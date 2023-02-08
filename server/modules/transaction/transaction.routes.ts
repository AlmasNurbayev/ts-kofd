import { FastifyInstance } from "fastify";
import { logger } from "../../utils/log-files";
import { getCheckTransactionHandler, getTransactionHandler } from "./transaction.controller";
import { getTransactionCheckSchema, getTransactionSchema } from "./transaction.schema";


export async function transactionRoutes(server: FastifyInstance) {
  logger.info('transaction - route - start');
  try {
    server.get('/',
      {
        preHandler: [server.authenticateAdmin],
        schema: getTransactionSchema.schema
      },
      getTransactionHandler);

      server.get('/check:',
      {
        preHandler: [server.authenticateAdmin],
        schema: getTransactionCheckSchema.schema
      },
      getCheckTransactionHandler);

  } catch (err) {
    logger.error('transaction.routes ' + err);
    //throw err;
  };
  logger.info('transaction - route - end');
}




export default transactionRoutes;