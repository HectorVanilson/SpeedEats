import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import { randomUUID} from 'crypto';
import {prisma} from '../bd';
import bcrypt from 'bcrypt'
import { UserRepository } from '../repositories/userRepository';
import fs from 'node:fs'
import { pipeline } from 'node:stream';
import util from 'node:util'
import path from 'path';
import { UPLOADDIR } from '../utils/constants';
const pump=util.promisify(pipeline);

interface UserProps{
    id?: string;
    email: string;
    name: string;
    password: string;
    phone?: number;
    address?: string;
    latitude?: string;
    longitude?: string;
    createdAt?: Date;
    updateAt: Date;
}

export class UsersController{
    
    userRepository= new UserRepository();
    async create(request: FastifyRequest, reply: FastifyReply){
        interface RequestBodyProps{
            name:string
            email:string
            password:string
        }
        const { name, email, password } = request.body as RequestBodyProps;
        const userExists = await this.userRepository.findByEmail(email);
        
        
        if(userExists){
            return reply.status(400).send({error: 'Úsuario ja existe'})
        }
        

        
        const user= await this.userRepository.save({ name, email, password });
         // Storing user data in the Map
        
        
        return reply.status(201).send( {
            ... user,
           password: undefined
          });
   
    }
    async show(request: FastifyRequest, reply: FastifyReply){
        interface RequestParamsProps{
            id: string;
        }

        const userId=request.userId

        console.log("USER ID: ", userId)
        
        const {id}= request.params as RequestParamsProps;
        const user = await prisma.user.findFirst({where: {id}});
        
        if(!user){
            return reply.status(404).send({error: 'Usuário não encontrado!'})
        }
        return reply.send(user);

    }

    async update(request: FastifyRequest, reply: FastifyReply){
        const userId= request.userId;
        console.log(userId);
        
        interface RequestBodyProps{
            name?: string,
            email?: string,
            phone?:number,
            address?:string,
            latitude?:string,
            longitude?: string,
        }
        const {email, address, latitude, longitude, name, phone}= request.body as RequestBodyProps;
       
        if(email){
        const userExists = await this.userRepository.findByEmail(email);
        if(userExists){
            return reply.status(400).send({error: 'Usuário Ja Existe!'})
        }
    }
        

        const updateUser = await this.userRepository.update(userId, {email, address, latitude, longitude, name, phone});
        return reply.send(updateUser);

    } 

    async changePass(request: FastifyRequest, reply: FastifyReply){
        const {password}=request.body as {password:string};
        const userId=request.userId;
        const updatedPassword= await this.userRepository.update(userId, {password});
        return reply.send(updatedPassword)
    }

    async changeAvatar(request: FastifyRequest, reply: FastifyReply){
        const file=await request.file()
        console.log("upload4");
        console.log(file)

        
        if(file){
        const filename=`${randomUUID()}_${file.filename}`
        const filePath=path.join(UPLOADDIR, filename)
        await pump(file.file, fs.createWriteStream(filePath))
        }
        return reply.send({})
    }
}
    // list(request: FastifyRequest, reply:FastifyReply){
    //     const {name}= request.query;

    //     let usersArr=Array.from(this.users).map((user)=>{
    //         return{
    //             id: user[0],
    //             ...user[1]
    //         };
    //     });
        
    //     if(name){
    //         usersArr=usersArr.filter((user)=>{
    //             return user.name.includes(name);
    //         });
    //     }

    //     return reply.send(usersArr);
    //     }
    // }