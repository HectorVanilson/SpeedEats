import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../bd";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { security } from "../consts/Security";
import { UserRepository } from '../repositories/userRepository';
import { generateToken } from "../services/authService";

interface SignUserProps{
    displayName: string
    email: string
    photoURL: string
}
export class AuthController{
    userRepository= new UserRepository();
    

    async login(request: FastifyRequest, reply: FastifyReply){
        interface RequestBodyProps{
            email: string
            password: string
        }
        const { email, password } = request.body as RequestBodyProps;
        const user= await this.userRepository.findByEmail(email);
        if (!user){
            return reply.status(404).send({error: 'Úsuario nao encontrado'})
        }
        if(!user.password)
            return reply.status(401).send({error: 'A autenticacao falhou'})
        if(!(await bcrypt.compare(password, user.password))){
            return reply.status(401).send({error: 'A autenticacao falhou'})
        }

        const token=generateToken(user);
        return reply.send({... user,password: undefined , token});
    }

async loginGoogle(request: FastifyRequest, reply: FastifyReply){
        const [,id_token]=request.headers.authorization?.split(" ") as unknown as string;
        
        
        // Build Firebase credential with the Google ID token.
const credential = GoogleAuthProvider.credential(id_token);

// Sign in with credential from the Google user.
const auth = getAuth();
try{
const sign = await signInWithCredential(auth, credential);
const {email, displayName: name, photoURL}= sign.user as SignUserProps;


let user = await this.userRepository.findByEmail(email);

if(!user){
    user= await this.userRepository.save({ name, email });
}

const token=generateToken(user);
        return reply.send({... user,password: undefined , token});




return reply.send(sign);
}
catch(error){
    
    // ...

    return reply.status(401).send({error});
}



        return reply.send({name: 'success'})
    }
}