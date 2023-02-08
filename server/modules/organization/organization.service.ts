import { Prisma } from "@prisma/client";
import { logger } from "../../utils/log-files";
import prismaI from "../../utils/prisma";

export async function postOrg(body: Prisma.organizationCreateInput) {
    console.log('service');
    logger.info('org-service-postOrg - starting');
    const { BIN, name_org } = body;
    //console.log(email, name, password);

        try {
            const data = {
                data: { BIN: BIN, name_org: name_org}
            };

            const org = await prismaI.organization.create(data);
            logger.info('org-service-postOrg - done');
            return org;
        }
        catch (err) {
            logger.error('org-service-postOrg ' + String(err));
            return false;
//            throw err;
        }

}

export async function getOrg() {
    console.log('service');
    logger.info('org-service-getOrg - starting');
    try {
        const org = await prismaI.organization.findMany();
        logger.info('org-service-getOrg - done');
        return org;
    }
    catch (err) {
        logger.error('org-service-getOrg ' + String(err));
        return false;
    }
}

export async function putOrg(body: Prisma.organizationUpdateInput) {
    console.log('service');
    logger.info('org-service-putOrg - starting');
    const { BIN, name_org} = body;
    //console.log(JSON.stringify(body));

    try {
        
        let oldOrg = await prismaI.organization.findUnique({
            where: {BIN: BIN as string},
        });
        if (oldOrg != null) {
            console.log(oldOrg);
            let updBody = oldOrg;

            if (name_org != oldOrg.name_org) {
                updBody.name_org = name_org as string;
            }
            const updOrg = await prismaI.organization.update({
                 where: { BIN: BIN as string },
                 data: updBody
             });
            logger.info('org-service-putOrg - done: ' + JSON.stringify(updBody));
            return updOrg; // return object with modified user

        } else {
            logger.error('org-service-putOrg ' + String('not found organization with BIN ') + BIN);
            return false; // retyrn false if org not found
        }
    }
    catch (err) {
        logger.error('org-service-putOrg ' + String(err));
        return false; // retyrn false if user not found
    }

}