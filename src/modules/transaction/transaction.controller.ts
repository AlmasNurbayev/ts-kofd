import { FastifyReply, FastifyRequest } from "fastify";
import moment from "moment";
import { loadavg } from "os";
import { logger } from "../../utils/log-files";
import { load } from "../get/load";

export async function getTransactionHandler(
    request: FastifyRequest,
    reply: FastifyReply) {

    logger.info('transaction - controller - GET request ' + JSON.stringify(request.headers).slice(0, 300));
    logger.info('transaction - controller - GET body ' + JSON.stringify(request.query).slice(0, 300));
    

    type loadT = {mode:string | {dateStart?: Date, dateEnd?: Date}, knumber?: Array<string>, BIN?: Array<string>}; 
    const body: any = request.query;        
    console.log('request transaction-GET', JSON.stringify(request.query));

    let a1: string | { dateStart: Date; dateEnd: Date; };
    if (body.mode) {
        a1 = body.mode;
    } else {
        a1 = {dateStart: moment(body.dateStart).toDate(), dateEnd:  moment(body.dateEnd).toDate() };
    };

    //console.log(a1, body.knumber, body.BIN);
    try {
        let res = await load(a1, body.knumber, body.BIN);
        logger.info('transaction-controller-GET done');
        reply.code(200).send(res?.table);
    } catch (err) {
        logger.error('transaction-controller-GET ' + String(err));
        reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
    }

}
