import { FastifyReply, FastifyRequest } from "fastify";
import { postKassaSchemaT } from "./kassa.schema";
import { logger } from "../../utils/log-files";
import bcrypt from 'bcrypt';



export async function postKassaHandler(
    request: FastifyRequest,
    reply: FastifyReply) {
        const body = request.body as postKassaSchemaT;

        //fs.writeFile('logs/body.txt', body.toString(), err =>{});
    
        logger.info('kassa - controller - POST request ' + JSON.stringify(request.headers).slice(0, 300));
        logger.info('kassa - controller - POST body ' + JSON.stringify(request.body).slice(0, 300));
    }

    export async function getKassaHandler(
        request: FastifyRequest,
        reply: FastifyReply) {
            const body = request.body as postKassaSchemaT;
    
            //fs.writeFile('logs/body.txt', body.toString(), err =>{});
        
            logger.info('kassa - controller - GET request ' + JSON.stringify(request.headers).slice(0, 300));
            logger.info('kassa - controller - GET body ' + JSON.stringify(request.body).slice(0, 300));
        }    