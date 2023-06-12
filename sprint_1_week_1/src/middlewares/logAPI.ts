import { NextFunction, Request, Response } from "express"
import { HttpStatusCode } from "../helpers/httpStatusCode"
import { apiLogsCollection } from "../repositories/db"
import { logAPIRepository } from "../repositories/logAPIRepository"

export const logAPIMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const currentDate = +new Date()
    const tenSecondsAgo = 10 * 1000

    const filter = {
        IP: req.ip,
        URL: req.baseUrl || req.originalUrl,
        method: req.method
    }

    const logEntry = {...filter, date: currentDate }
    const isAdded = await logAPIRepository.addLog(logEntry)
    if(!isAdded){
        // какую ошибку
        return res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR_500)
    }

    const logs = await apiLogsCollection.find(filter).toArray()
    const count = logs.filter(log => (currentDate - log.date) <= tenSecondsAgo)
    if(count.length > 5){
        return res.sendStatus(HttpStatusCode.TOO_MANY_REQUESTS_429)
    }

    return next()
}