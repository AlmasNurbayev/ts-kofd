console.log('Hello2');

import fastify from "fastify";

//import kassaRoutes from "./modules/kassa/kassa.routes";
import fjwt from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../src/utils/log-files";
import userRoutes from "./modules/user/user.routes";
import { putUserSchemaT, userShemas } from "./modules/user/user.schema";
import { swaggerInit } from "./utils/swagger";
import { getUser } from "./modules/user/user.service";
import {kassaRoutes} from "./modules/kassa/kassa.routes";
import { kassaShemas } from "./modules/kassa/kassa.schema";
import { orgShemas } from "./modules/organization/organization.schema";
import { orgRoutes } from "./modules/organization/organization.routes";
import dotenv from 'dotenv';
import transactionRoutes from "./modules/transaction/transaction.routes";

dotenv.config();
export const port = Number(process.env.PORT_EXPRESS);
export const server = fastify({ logger: true });

server.get('/check', async () => {
  return { status: 'ok' }
})


async function main() {
  logger.info('app.ts - register routes, etc.');
  //server.register(kassaRoutes, {prefix: 'api/kassa'});
  swaggerInit();

  /// регистрация всех схем
  userShemas.forEach((schema) => {
    server.addSchema(schema);
  });
  kassaShemas.forEach((schema) => {
    server.addSchema(schema);
  });
  orgShemas.forEach((schema) => {
    server.addSchema(schema);
  });

  // регистрация JWT
  server.register(fjwt, {
    secret: process.env.JWT_SECRET_CODE as string
  });


  // регистрация роутов по модулям
  server.register(userRoutes, { prefix: 'api/user' });
  server.register(kassaRoutes, { prefix: 'api/kassa' });
  server.register(orgRoutes, { prefix: 'api/org' });
  server.register(transactionRoutes, { prefix: 'api/transaction' });

  try {
    await server.listen({ port })
    logger.info('app.ts - starting ' + port);
  } catch (err) {
    logger.error('app.ts ' + err);
    server.log.error(err);
    process.exit(1);
  }
}

main();

server.decorate("authenticateAdmin", async function (request: FastifyRequest, reply: FastifyReply) {
  //console.log(JSON.stringify(reply));

  try {
    const decoded = await request.jwtVerify() as { 'email': string };
    if (decoded.email) {
      console.log(decoded.email);
      let user = await getUser({ 'email': decoded.email }); //получаем юзера по email
      if (user) {
        if (user.role as string != 'admin') { // проверяем роль юзера
          reply.code(403).send({ error: 'forbidden', message: 'is not admin' });
        }
      } else {
        console.log('authenticate - user');
        reply.send(new Error);
      }
    };
  } catch (err) {
    console.log('authenticate - jwt');
    reply.send(err);
  }
})

server.decorate("authenticateWithBodyEmail", async function (request: FastifyRequest, reply: FastifyReply) {
  //console.log(JSON.stringify(request.body));
  const  body  = request.body as putUserSchemaT;

  try {
    const decoded = await request.jwtVerify() as { 'email': string };
    if (decoded.email) {
      console.log(decoded.email);
      if (body.email) {
        if (body.email != decoded.email) {
          console.log('authenticate - jwt');
          reply.code(403).send({ error: 'forbidden', message: 'request email not valid with token email' });
        }
      }
    };
  } catch (err) {
    console.log('authenticate - jwt');
    reply.send(err);
  }
})


declare module "fastify" {
  export interface FastifyInstance {
    authenticateWithBodyEmail: any;
    authenticateAdmin: any;
  }
}
