import prisma from "../../utils/prisma";
import { createUserBody } from "./user.schema";
import bcrypt from "bcrypt";
import { FastifyRequest } from "fastify";
//const bcrypt = require('bcrypt');

export async function createUser(body: any) {
        console.log('service');

        const { email, name, password} = body;
        //console.log(email, name, password);

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(String(password), salt);
        
        try {
             const data2 = {
                 data: { email, name, salt: salt, password: hash},
                 };
                //console.log(data2);

            const user = await prisma.user.create(data2);
            return user;
        } 
        catch (err) {
            console.log(err, 'createUser-prisma');
            throw err;
        }
    } catch (err) {
        console.log(err, 'createUser-bcrypt');
        throw err;
    }
}      
                
            
            
        




