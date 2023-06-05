import { User } from "../models/User"
import jwt from 'jsonwebtoken'
import { userService } from "../domain/userService"
import { authorizationRepository } from "../repositories/authorizationRepository"
import { RefreshToken } from "../models/RefreshToken"
import { CreateJWT } from "../models/CreateJWT"

const secretKey = process.env.JWT_SECRET_KEY || '123'

export const jwtService = {
    async createJWT(user: User): Promise<CreateJWT | null> {
        const accessToken = jwt.sign({userId: user.id}, secretKey, {expiresIn: '10s'})
        const refreshToken = jwt.sign({userId: user.id}, secretKey, {expiresIn: '20s'})
        const token : RefreshToken = {
            token: refreshToken,
            isValid: true
        }
        const isAdded = await authorizationRepository.addRefreshToken(token)
        if(!isAdded) {
            return null
        }
        return {accessToken: accessToken, refreshToken: refreshToken}
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, secretKey)

            return result.userId
        } catch (err) {
            return null
        }
    }
}
