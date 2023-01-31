import { FastifyInstance } from "fastify";
import { logger } from "../../utils/log-files";
import { getTransactionHandler } from "./transaction.controller";
import { getTransactionSchema } from "./transaction.schema";


export async function transactionRoutes(server: FastifyInstance) {
  logger.info('transaction - route - start');
  try {
    server.get('/',
      {
        preHandler: [server.authenticateAdmin],
        schema: getTransactionSchema.schema
      },
      getTransactionHandler);
  } catch (err) {
    logger.error('transaction.routes ' + err);
    //throw err;
  };
  logger.info('transaction - route - end');
}




export default transactionRoutes;