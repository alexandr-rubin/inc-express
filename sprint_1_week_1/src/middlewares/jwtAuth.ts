import { NextFunction, Request, Response } from "express"
import { jwtService } from "../application/jwtService"
import { userService } from "../domain/userService"
import { User } from "../models/User"
import { Post } from "../models/Post"
import { Blog } from "../models/Blog"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserByIdToken(token)
    if(userId){
        const user = (await userService.getUsers(req)).items.find(item => item.id === userId)
        req.user = user
        return next()
    }

    return res.sendStatus(401)
}