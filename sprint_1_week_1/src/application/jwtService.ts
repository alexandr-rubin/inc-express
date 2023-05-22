import { User } from "../models/User"
import jwt from 'jsonwebtoken'
import { userService } from "../domain/userService"

const secretKey = process.env.JWT_SECRET_KEY || '123'

export const jwtService = {
    async createJWT(user: User) {
        const token = jwt.sign({userId: user.id, email: user.email, login: user.login}, secretKey, {expiresIn: '1h'})
        return token
    },
    async getUserByIdToken(token: string) {
        try {
            const result: any = jwt.verify(token, secretKey)
            const user = {
                email: result.email,
                login: result.login,
                userId: result.userId
            }
            return user
        } catch (err) {
            return null
        }
    }
}
