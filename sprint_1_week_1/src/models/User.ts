import { WithId } from 'mongodb'
import {
    getModelForClass,
    modelOptions,
    prop,
} from '@typegoose/typegoose'
import mongoose from 'mongoose'

// export type User = { 
//     id: string,
//     login: string,
//     password: string,
//     passwordSalt: string,
//     email: string,
//     createdAt: string,
//     confirmationEmail: {
//         confirmationCode: string,
//         expirationDate: Date,
//         isConfirmed: boolean
//     },
//     confirmationPassword: {
//         confirmationCode: string,
//         expirationDate: Date
//     }
// }

// export class User { 
//     @prop()
//     id?: string
//     @prop({ required: true })
//     login!: string
//     @prop({ required: true })
//     password!: string
//     @prop({ required: true })
//     passwordSalt!: string
//     @prop({ required: true })
//     email!: string
//     @prop({ required: true })
//     createdAt!: string
//     @prop({ required: true })
//     confirmationEmail!: {
//         confirmationCode: string,
//         expirationDate: Date,
//         isConfirmed: boolean
//     }
//     @prop({ required: true })
//     confirmationPassword!: {
//         confirmationCode: string,
//         expirationDate: Date
//     }
// }

export type UserViewModel ={
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export class User {
    constructor(public id: string, public login: string, public password: string, public passwordSalt: string, public email: string,
        public createdAt: string, public confirmationEmail : { confirmationCode: string, expirationDate: Date, isConfirmed: boolean}, 
        public confirmationPassword : {confirmationCode: string, expirationDate: Date})
    {}
}

const UserSchema = new mongoose.Schema<WithId<User>>({
    id: { type: String, require: true },
    login: { type: String, require: true },
    password: { type: String, require: true },
    passwordSalt: { type: String, require: true },
    email: { type: String, require: true },
    createdAt: { type: String, require: true },
    confirmationEmail: {
        confirmationCode: { type: String, require: true },
        expirationDate: { type: Date, require: true },
        isConfirmed: { type: String, require: true }
    },
    confirmationPassword: {
        confirmationCode: { type: String, require: true },
        expirationDate: { type: Date, require: true },
    }
})
export const UserModel =  mongoose.model('Users', UserSchema)
// export const UserModel = getModelForClass(User)