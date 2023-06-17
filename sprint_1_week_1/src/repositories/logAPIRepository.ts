import { APILog } from '../models/APILogs'
import { Device } from '../models/Device'
import { User } from '../models/User'
// import { apiLogsCollection, refreshTokensCollection } from '../repositories/db'
import { LogAPIModel } from '../models/APILogs'

export const logAPIRepository = {
    async addLog(logEntry: APILog): Promise<boolean> {
        try{
            await LogAPIModel.insertMany([logEntry])
            return true
        }
        catch(err) {
            return false
        }
    },
}