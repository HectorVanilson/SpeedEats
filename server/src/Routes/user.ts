import { FastifyInstance } from "fastify";
import { UsersController } from "../Controllers/UsersController";
import { authHook } from "../hooks/auth";
import { uploadHook } from "../hooks/upload";
import { request } from "http";
const usersController= new UsersController();

export async function userRoutes(fastify: FastifyInstance){
    fastify.post('/',(request, reply)=> usersController.create(request, reply));
    fastify.get('/',{preHandler:authHook} ,(request, reply)=> usersController.show(request, reply));
    fastify.put('/',{preHandler:authHook} ,(request, reply)=> usersController.update(request, reply));
    fastify.patch('/password', {preHandler: authHook}, (request, reply)=> usersController.changePass(request, reply));
    fastify.patch('/avatar', {preHandler: [authHook, uploadHook("avatar")]}, (request, reply)=> usersController.changeAvatar(request, reply))
}

