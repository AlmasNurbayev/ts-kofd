import { FastifyReply, FastifyRequest } from "fastify";
import { createUserBody, createUserSchema } from "./user.schema";
import { createUser } from "./user.service";

export async function createUserController(
    request: FastifyRequest,
    reply: FastifyReply) 
    {
        console.log('controller');
        const body = request.body;

        let body3;
        try {
            body3 = JSON.parse(String(body));
        } catch (err ) {
            return reply.code(400).send('not valid JSON');         
        }
        if (!request.validateInput(body3, createUserBody)) {
            return reply.code(400).send('not valid data');         
        }
        if (!String(body3.email).includes('@')) {
            return reply.code(400).send('email is not correct');         
        }
        try {
             const user = await createUser(body3);
             return reply.code(201).send(JSON.stringify(user));

         } catch (err) {
             console.log(err); // проверить тип ошибки
             if ((err instanceof Error) && (err.message.includes('Unique constraint failed on the fields: (`email`)'))) {
                return reply.code(409).send('email address already in use');   
            }
             return reply.code(500).send(err);

        }
    }