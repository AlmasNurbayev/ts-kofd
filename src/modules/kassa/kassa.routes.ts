import { FastifyInstance } from "fastify";
import { servicesVersion } from "typescript";
import { registerKassaHandler } from "./kassa.controller";

async function kassaRoutes(server: FastifyInstance) {
    
    server.post('/', registerKassaHandler);
}

export default kassaRoutes;