import { ResultCode } from "../helpers/resultCode"

export type Result<T> = {
    data: T | null,
    code: ResultCode,
    errorMessage: string | null
}