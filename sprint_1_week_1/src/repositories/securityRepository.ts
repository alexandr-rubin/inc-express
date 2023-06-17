import { Device } from '../models/Device'
import { User } from '../models/User'
//import { refreshTokensCollection } from '../repositories/db'
import { DeviceModel } from '../models/Device'

export const securityRepository = {
    async terminateAllDeviceSessions(userId: string, deviceId: string): Promise<boolean> {
        const isTerminated = (await DeviceModel.deleteMany({userId: userId, deviceId: {$ne: deviceId}})).acknowledged
        return isTerminated
    },
    async terminateSpecifiedDeviceSessions(deviceId: string, userId: string): Promise<boolean | null> {
        // возвращать объект как в комментах
        const device = await DeviceModel.findOne({deviceId: deviceId})
        if(!device){
            return false
        }
        if(device.userId !== userId) {
            return null
        }
        const isTerminated = (await DeviceModel.deleteOne({deviceId: deviceId})).acknowledged
        return isTerminated
    },
}