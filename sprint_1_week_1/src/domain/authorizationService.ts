import { Login } from "../models/Login"
import { User } from "../models/User"
import { AuthorizationRepository } from "../repositories/authorizationRepository"
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import bcrypt from 'bcrypt'
import { UserService } from "./userService"
import { UserRepository } from "../repositories/userRepository"
import { EmailService } from "./emailService"
import { ObjectId } from "mongodb"
import { UserQueryRepository } from "../queryRepositories/userQuertyRepository"

export class AuthorizationService {
    constructor(protected emailService: EmailService, protected userService: UserService, protected authorizationRepository: AuthorizationRepository,
        protected userRepository: UserRepository, protected userQueryRepository: UserQueryRepository){}
    async login(body: Login): Promise<User | null> {
        const login = {
            loginOrEmail: body.loginOrEmail,
            password: body.password
        }
        return this.authorizationRepository.login(login)
    }
    async createUser(user: User){
        const passSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.userService._generateHash(user.password, passSalt)
        const newUser: User = new User(new ObjectId().toString(), user.login, passwordHash, passSalt, user.email, new Date().toISOString(),
        {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 1,
                minutes: 3
            }),
            isConfirmed: false
        }, 
        {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 1,
                minutes: 3
            })
        })

        const createResult = await this.userRepository.addUser(newUser)
        await this.emailService.sendRegistrationConfirmationEmail(newUser.email, newUser.confirmationEmail.confirmationCode)
        return createResult
    }
    async confrmEmail(code: string): Promise<boolean>{
        const user = await this.userQueryRepository.findUserByConfirmationCode(code)
        if (!user)
            return false
        if (user.confirmationEmail.isConfirmed)
            return false
        if(user.confirmationEmail.expirationDate < new Date()){
            return false
        }
        
        const isUpdated = await this.userRepository.updateConfirmation(user.id)
        return isUpdated
    }
    async resendEmail(email: string): Promise<boolean>{
        const user = await this.userQueryRepository.getUserByEmail(email)
        if (!user)
            return false
        if (user.confirmationEmail.isConfirmed === false)
            return false
        if(user.confirmationEmail.expirationDate < new Date()){
            return false
        }
        console.log(user)
        const code = uuidv4()
        const isUpdated = await this.userRepository.updateConfirmationCode(user.id, code)
        if(!isUpdated){
            return false
        }
        await this.emailService.sendRegistrationConfirmationEmail(email, code)
        return true
    }
    async recoverPassword(email: string): Promise<boolean | null> {
        const user = await this.userQueryRepository.getUserByEmail(email)
        if(!user){
            return null
        }

        const code = uuidv4()
        const expirationDate = add(new Date(), {
            hours: 1,
            minutes: 3
        })

        const isUpdated = await this.userRepository.updateconfirmationPasswordData(email, code, expirationDate)

        if(!isUpdated){
            return false
        }
        
        await this.emailService.sendPasswordRecoverEmail(email, code)

        return true
    }
    async updatePassword(password: string, code: string): Promise<boolean>{
        const passSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.userService._generateHash(password, passSalt)
        const isUpdated = await this.userRepository.updatePassword(passwordHash, passSalt, code)
        if(!isUpdated){
            return false
        }

        return true
    }
}