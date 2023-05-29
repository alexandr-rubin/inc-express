import { User } from '../models/User'
import { usersCollection } from './db'
import { Paginator } from '../models/Paginator'
import { PaginationQuery } from '../models/PaginationQuery'
import { createPaginationResult } from '../helpers/pagination'
import { add } from 'date-fns'  

export const userRepository = {
    async getUsers(query: PaginationQuery): Promise<Paginator<User>> {
        const skip = (query.pageNumber - 1) * query.pageSize
        // fix any
        const search : any = {}
        if(query.searchLoginTerm != null){
            search.login = {$regex: query.searchLoginTerm, $options: 'i'}
        }
        if(query.searchEmailTerm != null){
            search.email = {$regex: query.searchEmailTerm, $options: 'i'}
        }
        const searchTermsArray = Object.keys(search).map(key => ({ [key]: search[key] }))
        const users = await usersCollection.find({$or: searchTermsArray.length === 0 ? [{}] : searchTermsArray}, {projection: {_id: false, password: false,passwordSalt: false, confirmationEmail: false}})
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip).limit(query.pageSize)
        .toArray()
        const count = await usersCollection.countDocuments({$or: searchTermsArray.length === 0 ? [{}] : searchTermsArray})
        const result = createPaginationResult(count, query, users)
        
        return result
    },
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
    async getUserByEmail(email: string): Promise<User | null> {
        const user = await usersCollection.findOne({email: email})
        return user
    },
    async getUserBylogin(login: string): Promise<User | null> {
        const user = await usersCollection.findOne({login: login})
        return user
    },
    async findUserByConfirmationCode(code: string): Promise<User | null>{
        const user = usersCollection.findOne({'confirmationEmail.confirmationCode': code})
        return user
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