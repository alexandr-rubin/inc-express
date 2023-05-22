import { Login } from "../models/Login"
import { User } from "../models/User"
import { loginRepository } from "../repositories/loginRepository"

export const loginService = {
    async login(body: Login): Promise<User | null> {
        const login = {
            loginOrEmail: body.loginOrEmail,
            password: body.password
        }
        return loginRepository.login(login)
    },
}