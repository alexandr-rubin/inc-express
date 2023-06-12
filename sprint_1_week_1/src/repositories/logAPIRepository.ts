import { APILog } from '../models/APILogs'
import { Device } from '../models/Device'
import { User } from '../models/User'
import { apiLogsCollection, refreshTokensCollection } from '../repositories/db'

export const logAPIRepository = {
    async addLog(logEntry: APILog): Promise<boolean> {
        const isAdded = (await apiLogsCollection.insertOne(logEntry)).acknowledged
        return isAdded
    },
}