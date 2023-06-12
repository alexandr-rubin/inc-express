import { Device } from '../models/Device'
import { User } from '../models/User'
import { refreshTokensCollection } from '../repositories/db'

export const securityRepository = {
    async terminateAllDeviceSessions(userId: string, deviceId: string): Promise<boolean> {
        const isTerminated = (await refreshTokensCollection.deleteMany({userId: userId, deviceId: {$ne: deviceId}})).acknowledged
        return isTerminated
    },
    async terminateSpecifiedDeviceSessions(deviceId: string, userId: string): Promise<boolean | null> {
        // возвращать объект как в комментах
        const device = await refreshTokensCollection.findOne({deviceId: deviceId})
        if(!device){
            return false
        }
        if(device.userId !== userId) {
            return null
        }
        const isTerminated = (await refreshTokensCollection.deleteOne({deviceId: deviceId})).acknowledged
        return isTerminated
    },
}