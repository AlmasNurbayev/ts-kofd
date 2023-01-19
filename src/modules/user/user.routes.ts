import { FastifyInstance } from "fastify";
import {createUserController} from "./user.controller";
import { createUserSchema, createUserBody } from "./user.schema"; 

async function userRoutes(server: FastifyInstance) {
  //console.log(JSON.stringify(createUserSchema));
    console.log('start route');
    server.post('/', createUserSchema, createUserController);
    console.log('end route');
}

export default userRoutes;