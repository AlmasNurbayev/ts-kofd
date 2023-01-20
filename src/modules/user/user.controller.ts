import { FastifyReply, FastifyRequest } from "fastify";
import createError from '@fastify/error';
import { logger } from "../../utils/log-files";
import { createUserBody, createUserSchema, createUserSchemaT } from "./user.schema";
import { createUser } from "./user.service";
import fs from 'fs';

export async function createUserController(
    request: FastifyRequest,
    reply: FastifyReply) 
    {
        console.log('controller');

        const body = request.body as createUserSchemaT;

        //fs.writeFile('logs/body.txt', body.toString(), err =>{});
       
        logger.info('user - controller - receive request ' + JSON.stringify(request.headers).slice(0,300));
        logger.info('user - controller - receive body ' + JSON.stringify(request.body).slice(0,300));

        let body3 = body;

        if (!request.validateInput(body3, createUserBody)) {
            logger.error('user - controller' + ' 400 - not valid data');
            return reply.code(400).send({error: 'bad request', message: 'not valid data in JSON: ' + JSON.stringify(body)});         
        }
        if (!(body3.email).includes('@')) {
            logger.error('user - controller' + ' 400 - email is not correct');
            return reply.code(400).send({error: 'bad request', message: 'email is not correct: ' + String(body3.email)});         
        }
        try {
             const user = await createUser(body3);
             logger.info('user - controller' + ' 201 ' + JSON.stringify(user).slice(0,300));
             return reply.code(201).send(JSON.stringify(user));

         } catch (err) {
             //console.log(err); // проверить тип ошибки
             if ((err instanceof Error) && (err.message.includes('Unique constraint failed on the fields: (`email`)'))) {
                logger.error('user - controller' + ' 409 - email address already in use');
                return reply.code(409).send({error: 'conflict', message: 'email address already in use: ' + String(body3.email)});
            }
             return reply.code(500).send({error: 'Internal Server Error', message: 'unknown error, please reply action'});
        }
    }