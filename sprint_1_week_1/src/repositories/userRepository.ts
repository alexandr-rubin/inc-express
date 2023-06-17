import { User } from '../models/User'
//import { usersCollection } from './db'
import { UserModel } from '../models/User'
import { add } from 'date-fns'  

export const userRepository = {
    async addUser(user: User): Promise<boolean> {
        try{
            await UserModel.insertMany([user])
            return true
        }
        catch(err){
            return false
        }
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await UserModel.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async testingDeleteAllUsers() {
        await UserModel.deleteMany({})
    },
    async updateConfirmation(id: string) {
        let result = await UserModel.updateOne({id: id}, {$set: {'confirmationEmail.isConfirmed': true}})
        return result.modifiedCount === 1
    },
    async updateConfirmationCode(id: string, code: string): Promise<boolean> {
        let result = await UserModel.updateOne({id: id}, {$set: {'confirmationEmail.confirmationCode': code, 'confirmationEmail.expirationDate': add(new Date(), { hours: 1, minutes: 3})}})
        return result.modifiedCount === 1
    }
}