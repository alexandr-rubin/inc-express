import mongoose from 'mongoose'
import { WithId } from 'mongodb'

// export type Device = {
//     issuedAt: string,
//     expirationDate: string,
//     IP: string,
//     deviceName: string,
//     deviceId: string,
//     userId: string,
//     isValid: boolean
// }

export class Device {
    constructor(public issuedAt: string, public expirationDate: string, public IP: string,
        public deviceName: string, public deviceId: string, public userId: string, public isValid: boolean){}
}

export const DeviceSchema = new mongoose.Schema<WithId<Device>>({
    issuedAt: { type: String, require: true },
    expirationDate: { type: String, require: true },
    IP: { type: String, require: true },
    deviceName: { type: String, require: true },
    deviceId: { type: String, require: true },
    userId: { type: String, require: true },
    isValid: { type: Boolean, require: true }
})
export const DeviceModel =  mongoose.model('Devices', DeviceSchema)