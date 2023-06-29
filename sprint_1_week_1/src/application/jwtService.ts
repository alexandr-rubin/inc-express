import { User } from "../models/User"
import jwt from 'jsonwebtoken'
import { UserService } from "../domain/userService"
import { AuthorizationRepository } from "../repositories/authorizationRepository"
import { Device } from "../models/Device"
import { CreateJWT } from "../models/CreateJWT"
import { v4 as uuidv4 } from 'uuid'
import { SecurityRepository } from "../repositories/securityRepository"

const secretKey = process.env.JWT_SECRET_KEY || '123'

export class JWTService {
    constructor(protected authorizationRepository: AuthorizationRepository, protected securityRepository: SecurityRepository){}
    createJWT(user: User, deviceId: string, issuedAt: string): CreateJWT {
        const accessToken = jwt.sign({userId: user.id}, secretKey, {expiresIn: '10m'})
        const refreshToken = jwt.sign({deviceId: deviceId, userId: user.id, issuedAt: issuedAt}, secretKey, {expiresIn: '20m'})
        const result = {accessToken: accessToken, refreshToken: refreshToken}

        return result
    }
    // убрать дублирование при создании и обновлении девайса
    async addDevice(user: User, userAgent: string | undefined, clientIP: string): Promise<CreateJWT | null> {
        if (!userAgent){
            userAgent = 'default device name'
        }
        const deviceId = uuidv4()
        const issuedAt = new Date().toISOString()
        const tokens = this.createJWT(user, deviceId, issuedAt)
        const decodedToken = jwt.verify(tokens.refreshToken, secretKey) as jwt.JwtPayload
        const expirationDate = new Date(decodedToken.exp! * 1000)
        const device: Device = new Device(issuedAt, expirationDate.toISOString(), clientIP, userAgent, deviceId, decodedToken.userId, true)
        const isAdded = await this.authorizationRepository.addDevice(device)
        if(!isAdded) {
            return null
        }

        return tokens
    }
    async updateDevice(refreshToken: string, clientIP: string, userAgent: string | undefined, user: User): Promise<CreateJWT | null> {
        try{
            const decodedToken: any = jwt.verify(refreshToken, secretKey)
            if (!userAgent){
                userAgent = 'default device name'
            }
            const deviceId = decodedToken.deviceId
            const issuedAt = new Date().toISOString()
            const tokens = this.createJWT(user, deviceId, issuedAt)
            const decodedNewToken: any = jwt.verify(tokens.refreshToken, secretKey)
            const expirationDate = new Date(decodedNewToken.exp! * 1000)
            const newDevice: Device = new Device(issuedAt, expirationDate.toISOString(), clientIP, userAgent, deviceId, decodedNewToken.userId, true)
            const isUpdated = await this.authorizationRepository.updateDevice(newDevice)
            if(!isUpdated){
                return null
            }
            return tokens
        }
        catch(err){
            return null
        }
    }
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, secretKey)
            return result.userId
        } catch (err) {
            return null
        }
    }
    // add device service
    async logoutDevice(refreshToken: string): Promise<boolean>{
        try{
            const decodedToken: any = jwt.verify(refreshToken, secretKey)
            const isLogedout = await this.authorizationRepository.logoutDevice(decodedToken.deviceId)
            return isLogedout
        }
        catch{
            return false
        }
    }
    async getDeviceByToken(token: string): Promise<Device | null>{
        try {
            const decodedToken: any = jwt.verify(token, secretKey)
            const device = await this.authorizationRepository.getDeviceByDeviceId(decodedToken.deviceId)
            return device
        }
        catch(err) {
            return null
        }
    }
    async compareTokenDate(token: string): Promise<boolean>{
        try{
            const decodedToken: any = jwt.verify(token, secretKey)
            const device = await this.getDeviceByToken(token)
            if(!device || decodedToken.issuedAt !== device.issuedAt){
                return false
            }
            return true
        }
        catch(err) {
            return false
        }
    }
    async terminateAllDeviceSessions(token: string): Promise<boolean>{
        try{
            const decodedToken: any = jwt.verify(token, secretKey)
            const isTerminated = await this.securityRepository.terminateAllDeviceSessions(decodedToken.userId, decodedToken.deviceId)
            return isTerminated
        }
        catch(err) {
            return false
        }
    }
    async terminateSpecifiedDeviceSessions(deviceId: string, token: string): Promise<boolean | null>{
        // TODO: вернуть объект вместо null
        try{
            const decodedToken: any = jwt.verify(token, secretKey)
            // if(decodedToken.userId !== userId){
            //     return null
            // }
            const isTerminated = await this.securityRepository.terminateSpecifiedDeviceSessions(deviceId, decodedToken.userId)
            return isTerminated
        }
        catch(err) {
            return false
        }
    }
}
