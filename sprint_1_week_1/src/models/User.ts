import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export type User = { 
    id: string,
    login: string,
    password: string,
    passwordSalt: string,
    email: string,
    createdAt: string,
    confirmationEmail: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    },
    confirmationPassword: {
        confirmationCode: string,
        expirationDate: Date
    }
}

// export class User {
//     constructor(public id: string, public login: string, public password: string, public passwordSalt: string, public email: string,
//         public createdAt: string, public confirmationEmail : { confirmationCode: string, expirationDate: Date, isConfirmed: boolean}, 
//         public confirmationPassword : {confirmationCode: string, expirationDate: Date})
//     {}
// }

// export class User { 
//     id: string
//     login: string
//     password: strin
//     passwordSalt: string
//     email: string
//     createdAt: string
//     confirmationEmail: {
//         confirmationCode: string,
//         expirationDate: Date,
//         isConfirmed: boolean
//     }
//     confirmationPassword: {
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

export const UserSchema = new mongoose.Schema<WithId<User>>({
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