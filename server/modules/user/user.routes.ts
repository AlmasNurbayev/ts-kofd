import { FastifyInstance } from "fastify";
import { logger } from "../../utils/log-files";
import { createUserController, getUsersController, getUserController, loginUserController, putUserController, deleteUserController} from "./user.controller";
import { createUserSchema, deleteUserSchema, getUsersSchema, loginUserSchema, putUserSchema } from "./user.schema";
import { getUserSchema, getUserBody } from "./user.schema";


async function userRoutes(server: FastifyInstance ) {

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
      preHandler: [server.authenticateAdmin],
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
      preHandler: [server.authenticateAdmin],
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
  try {
    server.put('/', 
    {
      preHandler: [server.authenticateWithBodyEmail],
      schema: putUserSchema.schema
    }, putUserController);
  } catch (err) {
    logger.error('user.routes - put ' + err);
    throw err;
  };
  try {
    server.delete('/', 
    {
      preHandler: [server.authenticateAdmin],
      schema: deleteUserSchema.schema
    }, deleteUserController);
  } catch (err) {
    logger.error('user.routes - delete once ' + err);
    throw err;
  };


  
  logger.info('user - route - end');
}

export default userRoutes;