import { User } from '../models/User'
import { usersCollection } from './db'
import { add } from 'date-fns'  

export const userRepository = {
    async addUser(user: User): Promise<boolean> {
        return (await usersCollection.insertOne(user)).acknowledged === true
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async testingDeleteAllUsers() {
        usersCollection.deleteMany({})
    },
    async updateConfirmation(id: string) {
        let result = await usersCollection.updateOne({id}, {$set: {'confirmationEmail.isConfirmed': true}})
        return result.modifiedCount === 1
    },
    async updateConfirmationCode(id: string, code: string) {
        let result = await usersCollection.updateOne({id}, {$set: {'confirmationEmail.confirmationCode': code, 'confirmationEmail.expirationDate': add(new Date(), { hours: 1, minutes: 3})}})
        return result.modifiedCount === 1
    }
}