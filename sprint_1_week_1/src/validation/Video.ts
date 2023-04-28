import { Video } from "../models/Video";

enum VideoResolutions { 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' }

let errorsMessages: { message: string; field: string }[] = []

export const postVideo = (video: Video) => {
    errorsMessages = []
    strValidation(video.title, 'title', 40)
    strValidation(video.author, 'author', 20)
    resolutionsValidation(video.availableResolutions)

    return errorsMessages
}

export const putVideo = (video: Video) => {
    errorsMessages = []
    strValidation(video.title, 'title', 40)
    strValidation(video.author, 'author', 20)
    canBeDownloaded(video.canBeDownloaded)
    minAgeRestriction(video.minAgeRestriction) 
    publicationValidation(video.publicationDate, video.createdAt)
    !video.availableResolutions ?? resolutionsValidation(video.availableResolutions)

    return errorsMessages
}

const strValidation = (str: string, field: string, len: number) => {
    if(typeof str !== 'string' || str.length > len || str.length == 0){
        errorsMessages.push({
            message: `Incorrect ${field}`,
            field: `${field}`
        })
    }
}
const resolutionsValidation = (resolutions: string[]) => {
    if(!Array.isArray(resolutions) || !resolutions.every((x: string) => Object.values(VideoResolutions).includes(x))){
        errorsMessages.push({
            message: 'Available Resolutions must be an array',
            field: 'availableResolutions'
        })
    }
}
const publicationValidation = (publicationDate: string, createdAt: string) => {
    if(publicationDate && (typeof publicationDate !== 'string' || isNaN(Date.parse(publicationDate)) || Date.parse(publicationDate) < Date.parse(createdAt))){
        errorsMessages.push({
            message: 'publicationDate must be a date format',
            field: 'publicationDate'
        })
    }
}
const canBeDownloaded = (canBeDownloaded: boolean) => {
    if(typeof canBeDownloaded !== 'boolean' && canBeDownloaded){
        errorsMessages.push({
            message: 'Field must be a boolean',
            field: 'canBeDownloaded'
        })
    }
}
const minAgeRestriction = (minAgeRestriction: number | null) => {
    if(minAgeRestriction && (typeof minAgeRestriction !== 'number' || minAgeRestriction > 18 || minAgeRestriction < 1)){
        errorsMessages.push({
            message: 'Min Age Restriction must be a number',
            field: 'minAgeRestriction'
        })
    }
}