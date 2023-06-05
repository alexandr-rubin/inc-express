import { User } from '../models/User'
import { usersCollection } from '../repositories/db'
import { Paginator } from '../models/Paginator'
import { createPaginationQuery, createPaginationResult } from '../helpers/pagination'
import { Request } from 'express'

export const userQueryRepository = {
    async getUsers(req: Request): Promise<Paginator<User>> {
        const query = createPaginationQuery(req)
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
    async getUserByEmail(email: string): Promise<User | null> {
        const user = await usersCollection.findOne({email: email})
        return user
    },
    async getUserBylogin(login: string): Promise<User | null> {
        const user = await usersCollection.findOne({login: login})
        return user
    },
    async getUserById(id: string): Promise<User | null> {
        const user = await usersCollection.findOne({id: id})
        return user
    },
    async findUserByConfirmationCode(code: string): Promise<User | null>{
        const user = usersCollection.findOne({'confirmationEmail.confirmationCode': code})
        return user
    }
}