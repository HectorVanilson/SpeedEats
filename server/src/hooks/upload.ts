import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function uploadHook(field: string){
  return (request: FastifyRequest, reply: FastifyReply, done: (error?:FastifyError)=>void)=>{
   console.log("upload");
    const file= request.body[field];
    console.log("upload2");
    console.log(file)
    console.log("upload3");
    done();
  }
}