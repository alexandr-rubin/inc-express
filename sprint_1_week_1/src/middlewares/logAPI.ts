import { NextFunction, Request, Response } from "express"
import { HttpStatusCode } from "../helpers/httpStatusCode"
// import { apiLogsCollection } from "../repositories/db"
import { LogAPIModel } from "../models/APILogs"
import { LogAPIRepository } from "../repositories/logAPIRepository"

export const logAPIMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const logAPIRepositoryInst = new LogAPIRepository()
    const currentDate = new Date();
    const tenSecondsAgo = new Date(currentDate.getTime() - 10 * 1000)

    const filter = {
        IP: req.ip,
        URL: req.originalUrl,
        date: { $gte: tenSecondsAgo.toISOString() }
    }

    const count = await LogAPIModel.countDocuments(filter)

    if(count >= 5){
        return res.sendStatus(HttpStatusCode.TOO_MANY_REQUESTS_429)
    }

    const logEntry = {...filter, date: currentDate.toISOString() }
    const isAdded = await logAPIRepositoryInst.addLog(logEntry)
    if(!isAdded){
        // какую ошибку
        return res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR_500)
    }

    return next()
}