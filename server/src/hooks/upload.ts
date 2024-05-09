import { randomUUID } from "crypto";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import path from 'path';
import fs from 'fs';

export function uploadHook(field: string){
  return (request: FastifyRequest, reply: FastifyReply, done: (error?:FastifyError)=>void)=>{
   console.log("upload");
    const file= request.body[field];
    console.log("upload2");
    console.log(file)
    console.log("upload3");
    const filename=`${randomUUID()}-${file.filename}`;
    const filePath=path.resolve(__dirname,'..','..','uploads',filename);
    fs.promises.writeFile(filePath, file._buf).then(()=>{

      done();
    }).catch((error)=>{
      return reply.status(400).send(error)
    });
    
  }
}