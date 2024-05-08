import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { security } from "../consts/Security";


export  function authHook(request: FastifyRequest, reply: FastifyReply, done: (error?:FastifyError)=>void){
    if(!request.headers.authorization){
        return reply.status(401).send({error: "Authorization token not found"});
    }
    const [,token]=request.headers.authorization.split(" ");
    try{
        const {id}=jwt.verify(token, security.SECRET) as{id:string};
        request.userId=id;
        console.log('AUTH')
        done();
    }
    catch(error){
        reply.status(401).send({error: "Invalid Token"});
    }
}