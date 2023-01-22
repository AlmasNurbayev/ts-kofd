console.log('Hello2');

import fastify from "fastify";
import dotenv from 'dotenv';
//dotenv.config();
//import kassaRoutes from "./modules/kassa/kassa.routes";
import userRoutes from "./modules/user/user.routes" ;
import {logger} from "../src/utils/log-files"
import { swaggerInit } from "./utils/swagger";

export const port = Number(process.env.PORT_EXPRESS);
export const server = fastify({logger: true});

server.get('/check', async () => {
    return { status: 'ok'}
  })
  

async function main() {
    logger.info('app.ts - register routes, etc.');
    //server.register(kassaRoutes, {prefix: 'api/kassa'});
    swaggerInit();
    server.register(userRoutes, {prefix: 'api/user'});
    //server.register(userRoutes, {prefix: 'api/user'});

    try {
        await server.listen({port})
        logger.info('app.ts - starting ' + port);
      } catch (err) {
        logger.error('app.ts ' + err);
        server.log.error(err);
        process.exit(1);
      }
}

main();