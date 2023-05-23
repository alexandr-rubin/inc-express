import { User } from "../models/User"
import jwt from 'jsonwebtoken'
import { userService } from "../domain/userService"

const secretKey = process.env.JWT_SECRET_KEY || '123'

export const jwtService = {
    async createJWT(user: User) {
        const token = jwt.sign({userId: user.id}, secretKey, {expiresIn: '1h'})
        return token
    },
    async getUserByIdToken(token: string) {
        try {
            const result: any = jwt.verify(token, secretKey)
            return result.userId
        } catch (err) {
            return null
        }
    }
}
