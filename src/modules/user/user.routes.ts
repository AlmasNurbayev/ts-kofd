import { FastifyInstance } from "fastify";
import { url } from "inspector";
import { logger } from "../../utils/log-files";
import { createUserController, getUsersController, getUserController, loginUserController} from "./user.controller";
import { createUserSchema, getUsersSchema, loginUserSchema } from "./user.schema";
import { getUserSchema, getUserBody } from "./user.schema";
import {server} from "../../app";
import {userPreHandlerAuth} from './user.handlers';

async function userRoutes(server: FastifyInstance ) {
  console.log('start route');
  logger.info('user - route - start');
  try {
    server.post('/', createUserSchema, createUserController);
  } catch (err) {
    logger.error('user.routes - post ' + err);
    throw err;
  };
  try {
    server.get('/all', 
    {
      preHandler: [server.authenticate],
      schema: getUsersSchema.schema
    }, 
    getUsersController);
  } catch (err) {
    logger.error('user.routes - get all ' + err);
    throw err;
  };
  try {
    server.get('/get/', 
    {
      preHandler: [server.authenticate],
      schema: getUserSchema.schema
    }, getUserController);
  } catch (err) {
    logger.error('user.routes - get once ' + err);
    throw err;
  };
  try {
    server.post('/login', loginUserSchema, loginUserController);
  } catch (err) {
    logger.error('user.routes - login ' + err);
    throw err;
  };



  console.log('end route');
  logger.info('user - route - end');
}

export default userRoutes;