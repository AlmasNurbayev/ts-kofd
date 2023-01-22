import { FastifyInstance } from "fastify";
import { logger } from "../../utils/log-files";
import { createUserController, getUsersController, getUserController} from "./user.controller";
import { createUserSchema, getUsersSchema } from "./user.schema";
import { getUserSchema, getUserBody } from "./user.schema";

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
    server.get('/all', getUsersSchema, getUsersController);
  } catch (err) {
    logger.error('user.routes - get all ' + err);
    throw err;
  };
  try {
    server.get('/:email', getUserSchema, getUserController);
  } catch (err) {
    logger.error('user.routes - get once ' + err);
    throw err;
  };

  console.log('end route');
  logger.info('user - route - end');
}

export default userRoutes;