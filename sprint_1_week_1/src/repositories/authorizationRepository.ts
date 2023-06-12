import { Login } from '../models/Login'
import { refreshTokensCollection, usersCollection } from './db'
import { userService } from '../domain/userService'
import { User } from '../models/User'
import { Device } from '../models/Device'

export const authorizationRepository = {
    async login(login: Login): Promise<User | null> {
        const user = await usersCollection.findOne({$or: [{login: login.loginOrEmail}, {email: login.loginOrEmail}]})
        if(user){
            const password = await userService._generateHash(login.password, user.passwordSalt)
            if(user.password === password){
                return user
            }
        }
        
        return null
    },
    async addDevice(device: Device): Promise<boolean> {
        const isAdded = (await refreshTokensCollection.insertOne(device)).acknowledged
        return isAdded
    },
    async updateDevice(device: Device): Promise<boolean> {
        const isUpdated = (await refreshTokensCollection.updateOne({deviceId: device.deviceId}, { $set: {
            issuedAt: device.issuedAt,
            expirationDate: device.expirationDate,
            IP: device.IP,
            deviceName: device.deviceName,
            deviceId: device.deviceId,
            userId: device.userId
        }})).acknowledged
        return isUpdated
    },
    async logoutDevice(deviceId: string): Promise<boolean> {
        const isUpdated = await refreshTokensCollection.updateOne({deviceId: deviceId}, { $set: {isValid: false}})
        return isUpdated.acknowledged
    },
    async getDeviceByDeviceId(deviceId: string): Promise<Device | null>{
        const device = await refreshTokensCollection.findOne({deviceId: deviceId})
        return device
    },
    async testingDeleteAllDevices(): Promise<boolean>{
        const result = await refreshTokensCollection.deleteMany({})
        return result.acknowledged
    }
}