import { User, UserViewModel } from '../models/User'
import { ObjectId } from 'mongodb'
import { userRepository } from '../repositories/userRepository'
import { Paginator } from '../models/Paginator'
import { Request } from "express"
import { createPaginationQuery } from '../helpers/pagination'
import bcrypt from 'bcrypt'

export const userService = {
    async getUsers(req: Request): Promise<Paginator> {
        const userQuery = createPaginationQuery(req)
        return await userRepository.getUsers(userQuery)
    },
    async addUser(user: User): Promise<UserViewModel> {
        const passSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(user.password, passSalt)
        const newUser: User = {
            id: new ObjectId().toString(),
            login: user.login,
            password: passwordHash,
            passwordSalt: passSalt,
            email: user.email,
            createdAt: new Date().toISOString()
        }
        const {password, passwordSalt, ...result} = newUser
        await userRepository.addUser(newUser)
        return result
    },
    async deleteUserById(id: string): Promise<boolean> {
        return await userRepository.deleteUserById(id)
    },
    async testingDeleteAllUsers() {
        userRepository.testingDeleteAllUsers()
    },
    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        console.log('hash: ' + hash)
        return hash
    }
}