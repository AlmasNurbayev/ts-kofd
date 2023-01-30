import { FastifyInstance } from "fastify";
import { postTransactionHandler } from "./transaction.controller";
import { postTransactionSchema } from "./transaction.schema";


export async function transactionRoutes(server: FastifyInstance) {
    
    server.post('/', 
    {
        preHandler: [server.authenticateAdmin],
        schema: postTransactionSchema.schema
      }, 
    postTransactionHandler);


}




export default transactionRoutes;