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