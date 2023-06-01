import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { HttpStatusCode } from "../helpers/httpStatusCode"

export const validationErrorsHandler = (req: Request, res: Response, next: NextFunction) => {
    const errorsMessages = validationResult(req).array({ onlyFirstError: true }).map(error => ({ message: error.msg, field: error.type === 'field' ? error.path : error.type }))
    //const error = validationResult(req).array()
    if (errorsMessages.length) {
        res.status(HttpStatusCode.BAD_REQUEST_400).json({ errorsMessages })
    }
    else {
        next()
    }
}