import { FastifyReply, FastifyRequest } from "fastify";
import moment from "moment";
import { loadavg } from "os";
import { isDataView } from "util/types";
import { logger } from "../../utils/log-files";
import { getCheck, getJWT } from "../get/api";
import { listT, load, sumSale } from "../get/load";
import dotenv from 'dotenv';



export async function getTransactionHandler(
    request: FastifyRequest,
    reply: FastifyReply) {

    logger.info('transaction - controller - GET request ' + JSON.stringify(request.headers).slice(0, 300));
    logger.info('transaction - controller - GET body ' + JSON.stringify(request.query).slice(0, 300));
    

    type loadT = {mode:string | {dateStart?: Date, dateEnd?: Date}, knumber?: Array<string>, BIN?: Array<string>, loadOperations?: boolean}; 
    const body: any  = request.query;        
    console.log('request transaction-GET', JSON.stringify(request.query));

    if (!body) {
        logger.error('transaction-controller-GET - not found query params');
        reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
        return;
    }    

    let a1: string | { dateStart: Date; dateEnd: Date; };
    if (body.mode) {
        a1 = String(body.mode);
    } else {
        a1 = {dateStart: moment(body.dateStart).toDate(), dateEnd:  moment(body.dateEnd).toDate() };
    };
    //console.log(a1, body.knumber, body.BIN);
    try {
        let res: {table: sumSale, list?: Array<listT>} | undefined = await load(a1, body.knumber, body.BIN);

        if (typeof(res) != 'object') {
            logger.error('transaction-controller-GET - res is not object');
            reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
            return;
        }
        //logger.info('transaction-controller-GET done');
        if (body.loadOperations) {
           //console.log(JSON.stringify(res));
           reply.code(200).send(res);
           logger.info('transaction-controller-GET done');
        } else {
           if (res != undefined) {
                if (res.list != undefined) {
                    delete res.list;
                }
                reply.code(200).send(res);
                logger.info('transaction-controller-GET done');
           } else {
                logger.error('transaction-controller-GET - undefined Load');
                reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
           }
        }

    } catch (err) {
        logger.error('transaction-controller-GET ' + String(err));
        reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
    }

}

export async function getCheckTransactionHandler(
    request: FastifyRequest,
    reply: FastifyReply) {

    logger.info('transaction - controller - GET Check request ' + JSON.stringify(request.headers).slice(0, 300));
    logger.info('transaction - controller - GET Check ' + JSON.stringify(request.query).slice(0, 300));
    console.log('request transaction-GET check', JSON.stringify(request.query));
    
    type bodyT = {id: string, knumber: string, BIN: string};
    const body  = request.query as bodyT;      
    let token: string;
    
    const {id, knumber, BIN} = body;
    try {
       dotenv.config();
       token = "Bearer " + String(await getJWT(BIN, String(process.env.KOFDPASSWORD)));
       //console.log(id, knumber, token);
        
       //return;
       if (token.length > 0) {
            let res = await getCheck(id, knumber, token);
            reply.code(200).send(res.data);
            logger.info('transaction-controller-GET check done');

       } else {
            reply.code(500).send({ error: 'internal server error', message: 'unknown error' });
            logger.error('transaction-controller-GET check - error token'); 
       } 

    } catch (err) {
       logger.error('transaction-controller-GET check - error ' + String(err).slice(0,500)); 
    }

}