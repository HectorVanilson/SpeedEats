import { security } from "../consts/Security";
import jwt from 'jsonwebtoken';

interface UserProps{
    id: string
}
export function generateToken(user:UserProps){
    const token=jwt.sign({'id': user.id},security.SECRET, {'expiresIn': security.EXPIRATE });
    return token;
}