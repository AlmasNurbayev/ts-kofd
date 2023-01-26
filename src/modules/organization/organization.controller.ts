import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../../utils/log-files";
import { getOrg, postOrg, putOrg } from "../organization/organization.service";
import { postOrgBody, postOrgSchemaT, putOrgSchemaT } from "./organization.schema";

export async function postOrgHandler(
    request: FastifyRequest,
    reply: FastifyReply) {
    const body = request.body as postOrgSchemaT;

    //fs.writeFile('logs/body.txt', body.toString(), err =>{});

    logger.info('Org - controller - POST request ' + JSON.stringify(request.headers).slice(0, 300));
    logger.info('Org - controller - POST body ' + JSON.stringify(request.body).slice(0, 300));

    if (!request.validateInput(body, postOrgBody)) {
        logger.error('org-controller' + ' 400 - not valid data');
        reply.code(400).send({ error: 'bad request', message: 'not valid data in JSON: ' + JSON.stringify(body) });
    }
    try {
        const org = await postOrg(body);

        if (org === false) {
            reply.code(500).send({ error: 'Internal Server Error', message: 'unknown error, please reply action' });
        }

        logger.info('org - controller' + ' 201 ' + JSON.stringify(org).slice(0, 300));
        reply.code(201).send(JSON.stringify(org));

    } catch (err) {
        //console.log(err); // проверить тип ошибки
        if ((err instanceof Error) && (err.message.includes('Unique constraint failed on the fields: (`BIN`)'))) {
            logger.error('org - controller' + ' 409 - BIN address already in use');
            reply.code(409).send({ error: 'conflict', message: 'BIN address already in use: ' + String(body.BIN) });
        }
        reply.code(500).send({ error: 'Internal Server Error', message: 'unknown error, please reply action' });
    }

    
}

export async function getOrgHandler(
    request: FastifyRequest,
    reply: FastifyReply) {
    //const body = request.body as postOrgSchemaT;

    //fs.writeFile('logs/body.txt', body.toString(), err =>{});

    logger.info('Org - controller - GET request ' + JSON.stringify(request.headers).slice(0, 300));
    

    try {
        const body = await getOrg();
        if (body === false) {
            reply.code(500).send({ error: 'Internal Server Error', message: 'unknown error, please reply action' });
            logger.error('org-service-getOrgs, not orgs return');
        }
        logger.info('org-service-getOrg' + ' 200 ' + JSON.stringify(body).slice(0, 300));
        //console.log(JSON.stringify(body));
        
        reply.code(200).send(body);
        

    } catch (err) {
        logger.error('org-service-getOrg ' + String(err));
        reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
    }


}

export async function putOrgHandler(
    request: FastifyRequest,
    reply: FastifyReply) {
    const body = request.body as putOrgSchemaT;

    //fs.writeFile('logs/body.txt', body.toString(), err =>{});

    logger.info('Org - controller - PUT request ' + JSON.stringify(request.headers).slice(0, 300));
    logger.info('Org - controller - PUT body ' + JSON.stringify(request.body).slice(0, 300));

    if (!body.BIN) {
        logger.error('org-service-putOrg ' + String('не передан BIN'));
        reply.code(400).send({ error: 'Bad Request', message: 'not contains BIN' });
    }

    try {
        const updOrg = await putOrg(body);
        if (updOrg === false) {
            logger.error('org-service-putOrg ' + String(body.BIN));
            reply.code(400).send({ error: 'Bad Request', message: 'not found' });
        } else {
            reply.code(200).send(updOrg);
        }
    }
    catch (err) {
        logger.error('org-service-putOrg ' + String(err));
        reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
    }
}  

