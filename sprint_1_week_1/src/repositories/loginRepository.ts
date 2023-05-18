import { Login } from '../models/Login'
import { usersCollection } from './db'
import { userService } from '../domain/userService'

export const loginRepository = {
    async login(login: Login): Promise<boolean> {
        const user = await usersCollection.findOne({$or: [{login: login.loginOrEmail}, {email: login.loginOrEmail}]})
        if(user){
            const password = await userService._generateHash(login.password, user.passwordSalt)
            if(user.password === password){
                return true
            }
        }
        
        return false
    },
}