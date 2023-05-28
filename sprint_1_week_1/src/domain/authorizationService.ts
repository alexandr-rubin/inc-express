import { Login } from "../models/Login"
import { User } from "../models/User"
import { authorizationRepository } from "../repositories/authorizationRepository"

export const authorizationService = {
    async login(body: Login): Promise<User | null> {
        const login = {
            loginOrEmail: body.loginOrEmail,
            password: body.password
        }
        return authorizationRepository.login(login)
    },
}