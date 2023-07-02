import { User, UserViewModel } from '../models/User'
import { ObjectId } from 'mongodb'
import { UserRepository } from '../repositories/userRepository'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import { injectable } from 'inversify'

@injectable()
export class UserService {
    constructor(protected userRepository: UserRepository){}
    async addUser(user: User): Promise<UserViewModel> {
        const passSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(user.password, passSalt)
        const newUser: User = new User(new ObjectId().toString(), user.login, passwordHash, passSalt, user.email, new Date().toISOString(),
        {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 1,
                minutes: 3
            }),
            isConfirmed: true
        }, 
        {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 1,
                minutes: 3
            })
        })
        const {password, passwordSalt, confirmationEmail, confirmationPassword, ...result} = newUser
        await this.userRepository.addUser(newUser)
        return result
    }
    async deleteUserById(id: string): Promise<boolean> {
        return await this.userRepository.deleteUserById(id)
    }
    async testingDeleteAllUsers() {
        this.userRepository.testingDeleteAllUsers()
    }
    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        console.log('hash: ' + hash)
        return hash
    }
}