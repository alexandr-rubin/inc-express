import { JWTService } from '../application/jwtService'
import { Device } from '../models/Device'
import { User } from '../models/User'
//import { refreshTokensCollection } from '../repositories/db'
import { DeviceModel } from '../models/Device'
import { injectable } from 'inversify'

@injectable()
export class SecurityQueryRepository {
    constructor(protected jwtService: JWTService){}
    async getDevicesForCurrentUser(token: string) {
        const userId = await this.jwtService.getUserIdByToken(token)
        const devices = await DeviceModel.find({userId: userId, isValid: true}).lean()
        const result = devices.map(device => {return {deviceId: device.deviceId, ip: device.IP, lastActiveDate: device.issuedAt, title: device.deviceName}})
        return result
    }
}