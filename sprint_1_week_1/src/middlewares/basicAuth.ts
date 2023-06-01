import { NextFunction, Request, Response } from "express"
import { HttpStatusCode } from "../helpers/httpStatusCode"

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization && req.headers.authorization === 'Basic YWRtaW46cXdlcnR5' || req.method === 'GET') {
        return next()
    }else {
        return res.status(HttpStatusCode.UNAUTHORIZED_401).json({ message: "Unauthorized" })
    }
}