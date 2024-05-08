import Fastify from 'fastify';
import {routes} from './Routes';
import { initializeApp } from "firebase/app";
import { firebaseConfig} from "./config/firebase"
const app = initializeApp(firebaseConfig);


const fastify=Fastify({});

fastify.register(routes);

fastify.listen({port: 3000}).then(()=>{
    console.log('Server running on port 3000 ');
});