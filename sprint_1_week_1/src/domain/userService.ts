import { User, UserViewModel } from '../models/User'
import { ObjectId } from 'mongodb'
import { userRepository } from '../repositories/userRepository'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'

export const userService = {
    async addUser(user: User): Promise<UserViewModel> {
        const passSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(user.password, passSalt)
        const newUser: User = {
            id: new ObjectId().toString(),
            login: user.login,
            password: passwordHash,
            passwordSalt: passSalt,
            email: user.email,
            createdAt: new Date().toISOString(),
            confirmationEmail: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: true
            }
        }
        const {password, passwordSalt, confirmationEmail, ...result} = newUser
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