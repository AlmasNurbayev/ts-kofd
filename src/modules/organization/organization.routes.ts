import { FastifyInstance } from "fastify";
import { getOrgHandler, postOrgHandler, putOrgHandler } from "./organization.controller";
import { getOrgSchema, postOrgSchema, putOrgSchema } from "./organization.schema";


export async function orgRoutes(server: FastifyInstance) {
    
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

}