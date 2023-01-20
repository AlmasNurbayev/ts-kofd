import { FastifyInstance } from "fastify";
import { logger } from "../../utils/log-files";
import {createUserController} from "./user.controller";
import { createUserSchema, createUserBody } from "./user.schema"; 

async function userRoutes(server: FastifyInstance) {
  //console.log(JSON.stringify(createUserSchema));
    console.log('start route');
    logger.info('user - route - start');  
    //console.log(JSON.stringify(createUserSchema));
    try {
    server.post('/', createUserSchema, createUserController);
    } catch(err) {
      throw err;
    };

    console.log('end route');
    logger.info('user - route - end');  
}

export default userRoutes;