import prismaI from "../../utils/prisma";
import { Prisma, user } from '@prisma/client'
//import { createUserBody } from "./user.schema";
import bcrypt from "bcrypt";
import { FastifyRequest } from "fastify";
import { logger } from "../../utils/log-files";
import { putUserSchemaT } from "./user.schema";
//const bcrypt = require('bcrypt');

export async function createUser(body: Prisma.userCreateInput) {
    //console.log('service');
    logger.info('user-service-createUser - starting');
    const { email, name, password } = body;
    //console.log(email, name, password);

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(String(password), salt);
        try {
            const data2 = {
                data: { email, name, salt, password: hash }
            };
            //console.log(data2);

            const user = await prismaI.user.create(data2);
            logger.info('user-service-createUser - done ' + email);
            return user;
        }
        catch (err) {
            logger.error('user-service-createUser ' + String(err));
            return false;
        }
    } catch (err) {
        logger.error('user-service-createUser ' + String(err));
        return false;
    }
}

export async function getUsers() {
    //console.log('service');
    logger.info('user-service-getUsers - starting');
    try {
        const users = await prismaI.user.findMany();
        logger.info('user-service-getUser - done');
        //console.log(users)
        return users;
    }
    catch (err) {
        logger.error('user-service-getUsers ' + String(err));
        return false;
    }
}

export async function getUser(body: Prisma.userWhereUniqueInput) {
    //console.log('service');
    const { email } = body;
    logger.info('user-service-getUser - starting ' + JSON.stringify(body));
    //console.log(JSON.stringify(body));
    
    try {
        if (email) {
            const user = await prismaI.user.findUnique({
                where: { email: email },
            });
            logger.info('user-service-getUser - done ' + email);
            return user;
        }

    }
    catch (err) {
        logger.error('user-service-getUser ' + String(err));
        return false;
    }
}

export async function putUser(body: Prisma.userUpdateInput) {
    //console.log('service');
    logger.info('user-service-putUser - starting');
    const { email, password, name } = body;
    //console.log(JSON.stringify(body));

    try {
        
        let oldUser = await prismaI.user.findUnique({
            where: {email: email as string},
        });
        if (oldUser != null) {
            //console.log(oldUser);
            let updBody = oldUser;

            if (password != oldUser.password) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(String(password), salt);
                updBody.password = hash; 
                updBody.salt = salt;    
            }        
            if (name != oldUser.name) {
                updBody.name = name as string;
            }
            const updUser = await prismaI.user.update({
                 where: { email: email as string },
                 data: updBody
             });
            logger.info('user-service-putUser - done: ' + JSON.stringify(updBody));
            return updUser; // return object with modified user

        } else {
            logger.error('user-service-putUser ' + String('не найден пользователь с данным e-mail'));
            return false; // retyrn false if user not found
        }


    }
    catch (err) {
        logger.error('user-service-putUser ' + String(err));
        return false; // retyrn false if user not found
    }
}

export async function deleteUser(body: Prisma.userWhereUniqueInput) {
    const { email } = body;
    logger.info('user-service-deleteUser - starting ' + JSON.stringify(body));
    
    try {
        if (email) {
            const user = await prismaI.user.delete({
                where: { email: email },
            });
            logger.info('user-service-deleteUser - done' + email);
            return user;
        }
    }
    catch (err) {
        logger.error('user-service-deleteUser ' + String(err));
        return false;
    }
}


