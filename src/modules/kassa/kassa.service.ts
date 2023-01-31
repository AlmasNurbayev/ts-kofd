import { Prisma } from "@prisma/client";
import { logger } from "../../utils/log-files";
import prismaI from "../../utils/prisma";
import { postKassaSchemaT } from "./kassa.schema";

export async function postKassa(body: Prisma.kassaCreateInput) {

    const data = {
        data: body
    };
    //console.log(JSON.stringify(data));
    
    try {
        const kassa = prismaI.kassa.create(data);
        logger.info('kassa-service-post - done');
        return kassa;
    }
    catch (err) {
        logger.error('kassa-service-post ' + String(err));
        console.log(err);
        return false;
//            throw err;
    }
}

export async function getKassa(body: Prisma.kassaWhereInput) {
    //console.log('service');
    logger.info('kassa-service-get - starting');
    // {znumber, knumber, snumber, id, id_organization} = body;
    // let filter;
    // body.forEach(element => {});
        

    try {
        const kassa = await prismaI.kassa.findMany({
            where: body
        });
        logger.info('kassa-service-get - done');
        //console.log('kassa', kassa)
        return kassa;
    }
    catch (err) {
        logger.error('kassa-service-get ' + String(err));
        return [];
    }
}

export async function putKassa(body: postKassaSchemaT) {

    const { znumber, knumber, snumber, name_kassa, id, id_organization } = body;

    //console.log(JSON.stringify(data));
    
    try {
        let oldKassa = await prismaI.kassa.findUnique({
            where: {id: id as number},
        });
        if (oldKassa != null) {
            console.log(oldKassa);
            let updBody = oldKassa;
            if (name_kassa != oldKassa.name_kassa) {
                updBody.name_kassa = name_kassa as string;
            }
            if (znumber != oldKassa.znumber) {
                updBody.znumber = znumber as string;
            }
            if (snumber != oldKassa.snumber) {
                updBody.snumber = snumber as string;
            }
            if (knumber != oldKassa.knumber) {
                updBody.knumber = knumber as string;
            }
            if (id_organization != oldKassa.id_organization) {
                updBody.id_organization = id_organization as number;
            }
            const kassa = prismaI.kassa.update({
                where: {id: id},
                data: updBody
            });
            logger.info('kassa-service-PUT - done');
            return kassa;
        } else {
            logger.error('kassa-service-PUT ' + String('not found kassa with id '+ id));
            return false; // retyrn false if user not found
        }
            


    }
    catch (err) {
        logger.error('kassa-service-PUT ' + String(err));
        console.log(err);
        return false;
//            throw err;
    }
}