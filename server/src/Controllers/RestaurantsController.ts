import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import { randomUUID} from 'crypto';

export class RestaurantsController{
    restaurants = new Map();

    create(request: FastifyRequest, reply:FastifyReply){
        const { name, contact, slogan } = request.body;

        if ( !!name || !contact || !slogan) {
            return reply.status(400).send({ error: " name, contact and slogan are required." });
        }
    
        const id = randomUUID();
    
       this.restaurants.set(id, { name, contact, slogan }); // Storing user data in the Map
        
        
        return reply.status(201).send({status: 'success'});
    }

    list(request: FastifyRequest, reply:FastifyReply){
        const {name}= request.query;

        let restaurantsArr=Array.from(this.restaurants).map((restaurant)=>{
            return{
                id: restaurant[0],
                ...restaurant[1]
            };
        });
        
        if(name){
            restaurantsArr=restaurantsArr.filter((restaurant)=>{
                return restaurant.name.includes(name);
            });
        }

        return reply.send(restaurantsArr);
        }
    }
