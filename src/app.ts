console.log('Hello2');

import fastify from "fastify";
//dotenv.config();
//import kassaRoutes from "./modules/kassa/kassa.routes";
import fjwt from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../src/utils/log-files";
import userRoutes from "./modules/user/user.routes";
import { userShemas } from "./modules/user/user.schema";
import { swaggerInit } from "./utils/swagger";
import { getUser } from "./modules/user/user.service";

export const port = Number(process.env.PORT_EXPRESS);
export const server = fastify({logger: true});

server.get('/check', async () => {
    return { status: 'ok'}
  })
  

async function main() {
    logger.info('app.ts - register routes, etc.');
    //server.register(kassaRoutes, {prefix: 'api/kassa'});
    swaggerInit();

    /// регистрация всех схем
    userShemas.forEach((schema) =>{
      //console.log(schema)
      server.addSchema(schema);  
    });   

    // регистрация JWT
    server.register(fjwt, {
      secret: process.env.JWT_SECRET_CODE as string
    });




    // регистрация роутов по модулям
    server.register(userRoutes, {prefix: 'api/user'});

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

server.decorate("authenticate", async function(request: FastifyRequest, reply: FastifyReply) {
  //console.log(JSON.stringify(reply));
  
  try {
    const decoded = await request.jwtVerify() as {'email': string};
    if (decoded.email) { 
      console.log(decoded.email);
      let user = await getUser({'email':decoded.email}); //получаем юзера по email
      if (user) {
        if (user.role as string != 'admin') { // проверяем роль юзера
          reply.code(403).send({error: 'forbidden', message: 'is not admin'});      
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



declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
    authenticateAdmin: any;
  }
}
