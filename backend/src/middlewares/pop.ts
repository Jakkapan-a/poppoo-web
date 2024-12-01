import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({path: __dirname + '/.env'});
const SECRET = process.env.SECRET || 'secret';

const prisma = new PrismaClient();

export const popMiddleware = async (req:any, res:any, next:any) => {
    // authorization bearer token
    const token = req.headers.authorization;

    if (token) {
        req.token = token;
    }else{
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        const token = req.token.split(' ')[1];
        req.user =jwt.verify(token, SECRET);
        console.log(req.user);

        const findToken = await prisma.tokenDb.count({
            where: {
                token: token
            }
        });
        console.log("find", findToken);

        if(findToken === 0){
            return res.status(401).json({message: 'Unauthorized'});
        }
    }catch (e:any) {
        return res.status(401).json({error: e.message, message: 'Unauthorized'});
    }
    next();
};