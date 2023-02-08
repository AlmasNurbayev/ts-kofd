import { FastifyInstance } from "fastify";
import { logger } from "../../utils/log-files";
import { getKassaHandler, postKassaHandler, putKassaHandler } from "./kassa.controller";
import { getKassaSchema, postKassaSchema, putKassaSchema } from "./kassa.schema";

export async function kassaRoutes(server: FastifyInstance) {
    logger.info('kassa - route - start');
    server.post('/', 
    {
        preHandler: [server.authenticateAdmin],
        schema: postKassaSchema.schema
      }, 
    postKassaHandler);

    server.get('/', 
    {
        preHandler: [server.authenticateAdmin],
        schema: getKassaSchema.schema
      }, 
    getKassaHandler);    

    server.put('/', 
    {
        preHandler: [server.authenticateAdmin],
        schema: putKassaSchema.schema
      }, 
    putKassaHandler);  
    logger.info('kassa - route - end');

}


