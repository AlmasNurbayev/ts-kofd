import { FastifyReply, FastifyRequest } from "fastify";
import { postKassaBody, postKassaSchemaT } from "./kassa.schema";
import { logger } from "../../utils/log-files";
import bcrypt from 'bcrypt';
import { getKassa, postKassa, putKassa } from "./kassa.service";



export async function postKassaHandler(
    request: FastifyRequest,
    reply: FastifyReply) {
    const body = request.body as postKassaSchemaT;
    console.log('request kassa-POST', JSON.stringify(request.body));

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
            logger.error('kassa - controller' + ' 409 - knumber already in use');
            reply.code(409).send({ error: 'conflict', message: 'knumber address already in use: ' + String(body.name_kassa) });
        }
        reply.code(500).send({ error: 'Internal Server Error', message: 'unknown error, please reply action' });
    }


}

export async function getKassaHandler(
    request: FastifyRequest,
    reply: FastifyReply) {
    const body = request.query as postKassaSchemaT;

    //fs.writeFile('logs/body.txt', body.toString(), err =>{});
    console.log('request kassa-GET', JSON.stringify(request.query));
    logger.info('kassa - controller - GET request ' + JSON.stringify(request.headers).slice(0, 300));
    //logger.info('kassa - controller - GET body ' + JSON.stringify(request.body).slice(0, 300));

    try {
        const kassa = await getKassa(body);
        if (kassa.length == 0) {
            reply.code(404).send({ error: 'bad request', message: 'not found' });
            logger.error('kassa-service-get, not kassa return');
        }

        logger.info('kassa-service-get' + ' 200 ' + JSON.stringify(kassa).slice(0, 300));
        reply.code(200).send(kassa);

    } catch (err) {
        logger.error('kassa-service-get ' + String(err));
        reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
    }


}

export async function putKassaHandler(
    request: FastifyRequest,
    reply: FastifyReply) {
        logger.info('user.controller - PUT headers ' + JSON.stringify(request.headers).slice(0, 300));
        logger.info('user.controller - PUT body ' + JSON.stringify(request.body).slice(0, 300));
        console.log('request kassa-PUT', JSON.stringify(request.body));

        const body = request.body as postKassaSchemaT;
    
        if (!body.id) {
            logger.error('kassa-service-PUT ' + String('не передан id'));
            reply.code(400).send({ error: 'Bad Request', message: 'not contains id' });
        }
    
        try {
            const updKassa = await putKassa(body);
            if (updKassa) {
                reply.code(200).send(updKassa);
            } else {
                logger.error('kassa-service-PUT ' + String(body.name_kassa));
                reply.code(400).send({ error: 'Bad Request', message: 'not found' });
            }
        }
        catch (err) {
            logger.error('kassa-service-PUT ' + String(err));
            reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
        }
    
}
