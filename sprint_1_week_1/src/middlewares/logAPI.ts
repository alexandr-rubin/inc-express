import { NextFunction, Request, Response } from "express"
import { HttpStatusCode } from "../helpers/httpStatusCode"
import { apiLogsCollection } from "../repositories/db"
import { logAPIRepository } from "../repositories/logAPIRepository"

export const logAPIMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const currentDate = new Date();
    const tenSecondsAgo = new Date(currentDate.getTime() - 10 * 1000)

    const filter = {
        IP: req.ip,
        URL: req.baseUrl || req.originalUrl,
        date: { $gte: tenSecondsAgo.toISOString() }
    }

    const count = await apiLogsCollection.countDocuments(filter)

    if(count >= 5){
        return res.sendStatus(HttpStatusCode.TOO_MANY_REQUESTS_429)
    }

    const logEntry = {...filter, date: currentDate.toISOString() }
    const isAdded = await logAPIRepository.addLog(logEntry)
    if(!isAdded){
        // какую ошибку
        return res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR_500)
    }

    return next()
}