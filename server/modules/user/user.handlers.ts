import {FastifyReply, FastifyRequest} from 'fastify';


export async function userPreHandlerAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
     await request.jwtVerify((err, decoded) => {
      if (err) {
        console.log('err1', err);
      }
      //console.log(decoded);
    });
  } catch (err) {
    console.log('err2', err);
  }
};


