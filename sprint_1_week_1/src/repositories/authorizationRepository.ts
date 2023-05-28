import { Login } from '../models/Login'
import { usersCollection } from './db'
import { userService } from '../domain/userService'
import { User } from '../models/User'

export const authorizationRepository = {
    async login(login: Login): Promise<User | null> {
        const user = await usersCollection.findOne({$or: [{login: login.loginOrEmail}, {email: login.loginOrEmail}]})
        if(user){
            const password = await userService._generateHash(login.password, user.passwordSalt)
            if(user.password === password){
                return user
            }
        }
        
        return null
    },
}