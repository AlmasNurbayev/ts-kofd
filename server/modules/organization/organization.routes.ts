import { FastifyInstance } from "fastify";
import { logger } from "../../utils/log-files";
import { getOrgHandler, postOrgHandler, putOrgHandler } from "./organization.controller";
import { getOrgSchema, postOrgSchema, putOrgSchema } from "./organization.schema";


export async function orgRoutes(server: FastifyInstance) {
    logger.info('organization - route - start');
    server.post('/', 
    {
        preHandler: [server.authenticateAdmin],
        schema: postOrgSchema.schema
      }, 
    postOrgHandler);

    server.get('/', 
    {
        preHandler: [server.authenticateAdmin],
        schema: getOrgSchema.schema
      }, 
    getOrgHandler);    

    server.put('/', 
    {
        preHandler: [server.authenticateAdmin],
        schema: putOrgSchema.schema
      }, 
    putOrgHandler);    
    logger.info('organization - route - end');   
}