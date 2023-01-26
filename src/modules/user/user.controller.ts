import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../../utils/log-files";
import { createUserBody, loginUserBody } from "./user.schema"; // схемы объектов на вход
import { createUserSchemaT, getUserSchemaT, loginUserSchemaT, putUserSchemaT } from "./user.schema"; // типы объектов на вход
import { createUser, getUsers, getUser, putUser, deleteUser } from "./user.service";
import bcrypt from 'bcrypt';
import fs from 'fs';
import { server } from "../../../src/app";



export async function createUserController(
    request: FastifyRequest,
    reply: FastifyReply) {
    console.log('controller');

    const body = request.body as createUserSchemaT;

    //fs.writeFile('logs/body.txt', body.toString(), err =>{});

    logger.info('user - controller - POST request ' + JSON.stringify(request.headers).slice(0, 300));
    logger.info('user - controller - POST body ' + JSON.stringify(request.body).slice(0, 300));

    let body3 = body;

    if (!request.validateInput(body3, createUserBody)) {
        logger.error('user - controller' + ' 400 - not valid data');
        reply.code(400).send({ error: 'bad request', message: 'not valid data in JSON: ' + JSON.stringify(body) });
    }
    if (!(body3.email).includes('@')) {
        logger.error('user - controller' + ' 400 - email is not correct');
        reply.code(400).send({ error: 'bad request', message: 'email is not correct: ' + String(body3.email) });
    }
    try {
        const user = await createUser(body3);
        if (user === false) {
            reply.code(500).send({ error: 'Internal Server Error', message: 'unknown error, please reply action' });
            logger.error('user-service-createUser, not user return');
        }

        logger.info('user - controller' + ' 201 ' + JSON.stringify(user).slice(0, 300));
        reply.code(201).send(JSON.stringify(user));

    } catch (err) {
        //console.log(err); // проверить тип ошибки
        if ((err instanceof Error) && (err.message.includes('Unique constraint failed on the fields: (`email`)'))) {
            logger.error('user - controller' + ' 409 - email address already in use');
            return reply.code(409).send({ error: 'conflict', message: 'email address already in use: ' + String(body3.email) });
        }
        reply.code(500).send({ error: 'Internal Server Error', message: 'unknown error, please reply action' });
    }
}

export async function getUsersController(
    request: FastifyRequest,
    reply: FastifyReply) {
    console.log('controller');
    logger.info('user - controller - GET users request ' + JSON.stringify(request.headers).slice(0, 300));

    try {
        const body = await getUsers();
        if (body === false) {
            reply.code(500).send({ error: 'Internal Server Error', message: 'unknown error, please reply action' });
            logger.error('user-service-getUsers, not users return');
        }

        logger.info('user-service-getUsers' + ' 200 ' + JSON.stringify(body).slice(0, 300));
        reply.code(200).send(body);

    } catch (err) {
        logger.error('user-service-getUsers ' + String(err));
        reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
    }
}

export async function getUserController(
    request: FastifyRequest,
    reply: FastifyReply) {
    console.log('controller');
    logger.info('user - controller - GET user request ' + JSON.stringify(request.headers).slice(0, 300));
    console.log('request', JSON.stringify(request.query));

    const { email } = request.query as getUserSchemaT;
    try {
        const body = await getUser({ email: email });
        if (body) {
            logger.info('user-service-getUser' + ' 200 ' + JSON.stringify(body).slice(0, 300));
            reply.code(200).send(body);
        } else {
            reply.code(404).send({ error: 'bad request', message: 'not found user by email ' + email });
            logger.error('user-service-getUser ' + 'not found user by email ' + email);
        }
    } catch (err) {
        logger.error('user-service-getUser ' + String(err));
        reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
    }
}

export async function loginUserController(
    request: FastifyRequest,
    reply: FastifyReply) {
    const body = request.body as loginUserSchemaT;
    logger.info('user.controller - login POST headers ' + JSON.stringify(request.headers).slice(0, 300));
    logger.info('user.controller - login POST body ' + JSON.stringify(request.body).slice(0, 300));

    if (!request.validateInput(body, loginUserBody)) {
        logger.error('user - controller' + ' 400 - not valid data');
        reply.code(400).send({ error: 'bad request', message: 'not valid data in JSON: ' + JSON.stringify(body) });
    }
    if (!(body.email).includes('@')) {
        logger.error('user - controller' + ' 400 - email is not correct');
        reply.code(400).send({ error: 'bad request', message: 'email is not correct: ' + String(body.email) });
    }

    try {
        // find user by email
        const user = await getUser(body) as loginUserSchemaT;
        if (!user) {
            reply.code(401).send({ error: 'Unauthorized', message: 'incorrect email / password' });
            logger.error('user-service-loginUser ' + '401 incorrect email / password');
        }

        // verify password
        const correctPassword = await bcrypt.compare(body.password, user.password); // сравниваем переданный пароль и хеш в базе
        if (correctPassword) {
            // generate JWT
            const accessToken = server.jwt.sign({ id: user.id, email: user.email }, { expiresIn: process.env.JWT_EXP_MS }); // генерируем токен и передаем клиенту
            reply.code(200).send({ email: user.email, accessToken: accessToken });
        } else {
            reply.code(401).send({ error: 'Unauthorized', message: 'incorrect email / password' }); // отказ если хеш не подходит
            logger.error('user-service-loginUser ' + '401 incorrect email / password');
        }
    }
    catch (err) {
        logger.error('user-service-loginUser ' + String(err));
        reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
    }
}

export async function putUserController(
    request: FastifyRequest,
    reply: FastifyReply) {

    logger.info('user.controller - login POST headers ' + JSON.stringify(request.headers).slice(0, 300));
    logger.info('user.controller - login POST body ' + JSON.stringify(request.body).slice(0, 300));

    const body = request.body as putUserSchemaT;

    if (!body.email) {
        logger.error('user-service-putUsers ' + String('не передан email'));
        reply.code(400).send({ error: 'Bad Request', message: 'not contains email' });
    }

    try {
        const updUser = await putUser(body);
        if (updUser) {
            reply.code(200).send(updUser);
        } else {
            logger.error('user-service-putUsers ' + String(body.email));
            reply.code(400).send({ error: 'Bad Request', message: 'not found' });
        }
    }
    catch (err) {
        logger.error('user-service-putUsers ' + String(err));
        reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
    }
}

export async function deleteUserController(
    request: FastifyRequest,
    reply: FastifyReply) {
    console.log('controller');
    logger.info('user - controller - DELETE user request ' + JSON.stringify(request.headers).slice(0, 300));
    console.log('request', JSON.stringify(request.query));

    const { email } = request.query as getUserSchemaT;
    try {
         const body = await deleteUser({ email: email });
         if (body) {
             logger.info('user-service-deleteUser' + ' 200 ' + JSON.stringify(body).slice(0, 300));
             reply.code(200).send(body);
         } else {
             reply.code(404).send({ error: 'bad request', message: 'not found user by email ' + email });
             logger.error('user-service-deleteUser ' + 'not found user by email ' + email);
         }
    } catch (err) {
        logger.error('user-service-deleteUser ' + String(err));
        reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
    }
}