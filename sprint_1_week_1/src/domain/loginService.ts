import { Login } from "../models/Login"
import { loginRepository } from "../repositories/loginRepository"

export const loginService = {
    async login(body: Login): Promise<boolean> {
        const login = {
            loginOrEmail: body.loginOrEmail,
            password: body.password
        }
        return loginRepository.login(login)
    },
}