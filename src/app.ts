console.log('Hello2');

import fastify from "fastify";
import dotenv from 'dotenv';
dotenv.config();
//import kassaRoutes from "./modules/kassa/kassa.routes";
import userRoutes from "./modules/user/user.routes" ;

export const port = Number(process.env.PORT_EXPRESS);
const server = fastify({logger: false});
console.log(port);

server.get('/check', async () => {
    return { status: 'ok'}
  })
  

async function main() {

    //server.register(kassaRoutes, {prefix: 'api/kassa'});
    server.register(userRoutes, {prefix: 'api/user'});
    try {
        await server.listen({port})
      } catch (err) {
        server.log.error(err);
        process.exit(1);
      }
}

main();