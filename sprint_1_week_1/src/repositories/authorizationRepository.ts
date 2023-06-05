import { Login } from '../models/Login'
import { refreshTokensCollection, usersCollection } from './db'
import { userService } from '../domain/userService'
import { User } from '../models/User'
import { RefreshToken } from '../models/RefreshToken'

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
    async addRefreshToken(refreshToken: RefreshToken): Promise<boolean> {
        const isAdded = (await refreshTokensCollection.insertOne(refreshToken)).acknowledged
        return isAdded
    },
    async getRefreshToken(refreshToken: string): Promise<RefreshToken | null> {
        const token = await refreshTokensCollection.findOne({token: refreshToken})
        return token
    },
    async updateRefreshToken(refreshToken: string): Promise<boolean> {
        const isUpdated = (await refreshTokensCollection.updateOne({token: refreshToken}, { $set: {isValid: false}})).acknowledged
        return isUpdated
    }
}