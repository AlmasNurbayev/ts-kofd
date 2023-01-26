import { FastifyInstance } from "fastify";
import { getKassaHandler, postKassaHandler } from "./kassa.controller";
import { getKassaSchema, postKassaSchema } from "./kassa.schema";

export async function kassaRoutes(server: FastifyInstance) {
    
    server.post('/', 
    {
        preHandler: [server.authenticateAdmin],
        schema: postKassaSchema.schema
      }, 
    postKassaHandler);

    server.get('/all', 
    {
        preHandler: [server.authenticateAdmin],
        schema: getKassaSchema.schema
      }, 
    getKassaHandler);    
}




export default kassaRoutes;