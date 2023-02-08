export const port = Number(process.env.PORT_EXPRESS);
import { logger } from "./log-files";
import {server} from "../app";
import {createUserSchema} from "../modules/user/user.schema"

export async function swaggerInit() {
    //server.addSchema(createUserSchema);
    server.register(require('@fastify/swagger'), {
        swagger: {
          info: {
            title: 'TS-KOFD swagger page',
            description: 'api for project ts-kofd',
            version: '0.1.0'
          },
          host: 'localhost:' + String(port),
          schemes: ['http'],
          consumes: ['application/json'],
          produces: ['application/json'],
          tags: [
            { name: 'user', description: 'User related end-points' },
            { name: 'kassa', description: 'Kassa related end-points' },
            { name: 'organization', description: 'Organization related end-points' },
            { name: 'transaction', description: 'Transaction related end-points' },
          ],          
        },
        exposeRoute: true,
        routePrefix: '/docs'
      })
      server.register(require('@fastify/swagger-ui'), {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false
        },
        // uiHooks: {
        //     onRequest: function (request, reply, next) { next() },
        //     preHandler: function (request, reply, next) { next() }
        // },
        // staticCSP: true,
        // transformStaticCSP: (header) => header,
        // transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
        // transformSpecificationClone: true
    })
    //server.addSchema(createUserSchema);
    await server.ready();
    console.log('swagger url ' + 'http://localhost:' + String(port) + '/docs');
    logger.info('swagger url ' + 'http://localhost:' + String(port) + '/docs');
    
}