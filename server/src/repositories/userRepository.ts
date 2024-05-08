import { prisma } from "../bd";
import bcrypt from 'bcrypt'

interface saveUserProps{
    name:string
    email:string
    password?:string

};
interface UpdateUserProps{
    name?: string,
    email?: string,
    phone?:number,
    address?:string,
    latitude?:string,
    longitude?: string,
    password?:string
}
export class UserRepository{
    client= prisma.user;
    
    async save(user:saveUserProps){
        const {name, email, password}=user
        const passwordHash = password? await bcrypt.hash(password, 10):null;
        const savedUser= await this.client.create({
            
            data:{
                name,
                email,
                password: passwordHash
            }

        })
         // Storing user data in the Map
        return savedUser;

    }

    async findByEmail(email: string){
        const user = await this.client.findUnique({
            where: {
                email
            }
        })
        return user;
    }

    async update(id:string, {email,
        address,
        latitude,
        longitude,
        name,
        phone,
        password}: UpdateUserProps){
            
        const passwordHash = password? await bcrypt.hash(password, 10):undefined;
        const updateUser = await this.client.update({
            data: {
                email,
                address,
                latitude,
                longitude,
                name,
                phone,
                password: passwordHash
            },
            where:{
                id
            }
        })
        return {...updateUser, password: undefined}

    }
}