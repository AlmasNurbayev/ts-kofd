import { FastifyReply, FastifyRequest } from "fastify";
import { postKassaBody, postKassaSchemaT } from "./kassa.schema";
import { logger } from "../../utils/log-files";
import bcrypt from 'bcrypt';
import { postKassa } from "./kassa.service";



export async function postKassaHandler(
    request: FastifyRequest,
    reply: FastifyReply) {
        const body = request.body as postKassaSchemaT;

        //fs.writeFile('logs/body.txt', body.toString(), err =>{});
    
        logger.info('kassa - controller - POST request ' + JSON.stringify(request.headers).slice(0, 300));
        logger.info('kassa - controller - POST body ' + JSON.stringify(request.body).slice(0, 300));

        if (!request.validateInput(body, postKassaBody)) {
            logger.error('kassa-controller' + ' 400 - not valid data');
            reply.code(400).send({ error: 'bad request', message: 'not valid data in JSON: ' + JSON.stringify(body) });
        }
        try {
            const kassa = await postKassa(body);
    
            if (kassa === false) {
                reply.code(500).send({ error: 'Internal Server Error', message: 'unknown error, please reply action' });
            }
    
            logger.info('kassa - controller' + ' 201 ' + JSON.stringify(kassa).slice(0, 300));
            reply.code(201).send(JSON.stringify(kassa));
    
        } catch (err) {
            //console.log(err); // проверить тип ошибки
            if ((err instanceof Error) && (err.message.includes('Unique constraint failed on the fields: (`knumber`)'))) {
                logger.error('org - controller' + ' 409 - knumber already in use');
                reply.code(409).send({ error: 'conflict', message: 'knumber address already in use: ' + String(kassa.knumber) });
            }
            reply.code(500).send({ error: 'Internal Server Error', message: 'unknown error, please reply action' });
        }


    }

    export async function getKassaHandler(
        request: FastifyRequest,
        reply: FastifyReply) {
            const body = request.body as postKassaSchemaT;
    
            //fs.writeFile('logs/body.txt', body.toString(), err =>{});
        
            logger.info('kassa - controller - GET request ' + JSON.stringify(request.headers).slice(0, 300));
            logger.info('kassa - controller - GET body ' + JSON.stringify(request.body).slice(0, 300));
        }    