import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export type APILog = {
    IP: string,
    URL: string,
    date: string
}

export const APILogSchema = new mongoose.Schema<WithId<APILog>>({
    IP: { type: String, require: true },
    URL: { type: String, require: true },
    date: { type: String, require: true }
})
export const LogAPIModel =  mongoose.model('APILogs', APILogSchema)