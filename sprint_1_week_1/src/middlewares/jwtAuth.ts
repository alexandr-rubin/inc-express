import { NextFunction, Request, Response } from "express"
import { jwtService } from "../application/jwtService"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    
    const token = req.headers.authorization.split(' ')[1]
    const user = await jwtService.getUserByIdToken(token)
    if(user){
        req.body.user = user
        return next()
    }

    return res.sendStatus(401)
}