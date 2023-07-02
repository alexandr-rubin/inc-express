import { Login } from '../models/Login'
//import { refreshTokensCollection, usersCollection } from './db'
import { UserModel } from '../models/User'
import { DeviceModel } from '../models/Device'
import { UserService } from '../domain/userService'
import { User } from '../models/User'
import { Device } from '../models/Device'
import { injectable } from 'inversify'

@injectable()
export class AuthorizationRepository {
    constructor(protected userService: UserService){}
    async login(login: Login): Promise<User | null> {
        const user = await UserModel.findOne({$or: [{login: login.loginOrEmail}, {email: login.loginOrEmail}]})
        if(user){
            const password = await this.userService._generateHash(login.password, user.passwordSalt)
            if(user.password === password){
                return user
            }
        }
        
        return null
    }
    async addDevice(device: Device): Promise<boolean> {
        try{
            await DeviceModel.insertMany([device])
            return true
        }
        catch(err){
            return false
        }
    }
    async updateDevice(device: Device): Promise<boolean> {
        const isUpdated = (await DeviceModel.updateOne(device)).acknowledged
        return isUpdated
    }
    async logoutDevice(deviceId: string): Promise<boolean> {
        const isUpdated = await DeviceModel.updateOne({deviceId: deviceId}, { $set: {isValid: false}})
        return isUpdated.acknowledged
    }
    async getDeviceByDeviceId(deviceId: string): Promise<Device | null>{
        const device = await DeviceModel.findOne({deviceId: deviceId})
        return device
    }
    async testingDeleteAllDevices(){
        await DeviceModel.deleteMany({})
    }
}