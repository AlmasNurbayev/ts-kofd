import prismaI from "../../utils/prisma";
import { Prisma, user } from '@prisma/client'
//import { createUserBody } from "./user.schema";
import bcrypt from "bcrypt";
import { FastifyRequest } from "fastify";
import { logger } from "../../utils/log-files";
//const bcrypt = require('bcrypt');

export async function createUser(body: Prisma.userCreateInput) {
        console.log('service');
        logger.info('user-service-createUser - starting'); 
        const { email, name, password} = body;
        //console.log(email, name, password);

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(String(password), salt);
        try {
             const data2 = {
                  data: {email, name, salt, password: hash}};
                //console.log(data2);

            const user = await prismaI.user.create(data2);
            logger.info('user-service-createUser - done'); 
            user['salt'] = '';
            user['password'] = '';
            return user;
        } 
        catch (err) {
            logger.error('user-service-createUser ' + String(err)); 
            throw err;
        }
    } catch (err) {
        logger.error('user-service-createUser ' + String(err)); 
        throw err;
    }
}      
                
            
            
        




