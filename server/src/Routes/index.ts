

import Fastify, { FastifyInstance } from "fastify";
import { randomUUID } from 'crypto';
import { MenuItemsController } from '../Controllers/MenuItemsController';
import {  UsersController } from "../Controllers/UsersController";
import { RestaurantsController } from "../Controllers/RestaurantsController";
import { userRoutes } from "./user";
import { AuthController } from "../Controllers/AuthController";
import fastifyMultipart from "@fastify/multipart";
// import Fastify from "fastify";
// const fastify = Fastify({
//     logger: true
//   })

const menuItemsController=new MenuItemsController();
const restaurantsController = new RestaurantsController();
const usersController = new UsersController();
const authController= new AuthController();


export async function routes(fastify: FastifyInstance){
    fastify.decorateRequest("userId","");
    fastify.get('/', (request, reply)=>{
        return reply.send('Hello Fastifiy');
    });
    

    fastify.register(fastifyMultipart, {attachFieldsToBody: true})

    fastify.register(userRoutes, {
        prefix: "/users"
    })
    
  
    
    fastify.post('/restaurants',(request, reply)=> restaurantsController.create(request, reply));
    fastify.get('/restaurants', (request, reply)=> restaurantsController.list(request, reply));
    
    
    
    
    fastify.post('/menuItems',(request, reply)=> menuItemsController.create(request, reply));
    fastify.get('/menuItems', (request, reply)=> menuItemsController.list(request, reply));
    
    fastify.post('/auth', (request, reply)=> authController.login(request, reply))
    
    fastify.post('/auth/google', (request, reply)=> authController.loginGoogle(request, reply))
    
    
}