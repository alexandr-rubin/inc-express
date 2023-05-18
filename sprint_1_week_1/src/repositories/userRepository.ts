import { User } from '../models/User'
import { usersCollection } from './db'
import { Paginator } from '../models/Paginator'
import { PaginationQuery } from '../models/PaginationQuery'
import { createPaginationResult } from '../helpers/pagination'

export const userRepository = {
    async getUsers(query: PaginationQuery): Promise<Paginator> {
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
        const users = await usersCollection.find({$or: searchTermsArray.length === 0 ? [{}] : searchTermsArray}, {projection: {_id: false, password: false,passwordSalt: false}})
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip).limit(query.pageSize)
        .toArray()
        const count = await usersCollection.countDocuments(search)
        const result = createPaginationResult(count, query, users)
        
        return result
    },
    async addUser(user: User): Promise<boolean> {
        // TODO: return
        return (await usersCollection.insertOne(user)).acknowledged === true
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async testingDeleteAllUsers() {
        usersCollection.deleteMany({})
    }
}