"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putVideo = exports.postVideo = void 0;
var VideoResolutions;
(function (VideoResolutions) {
    VideoResolutions[VideoResolutions["P144"] = 0] = "P144";
    VideoResolutions[VideoResolutions["P240"] = 1] = "P240";
    VideoResolutions[VideoResolutions["P360"] = 2] = "P360";
    VideoResolutions[VideoResolutions["P480"] = 3] = "P480";
    VideoResolutions[VideoResolutions["P720"] = 4] = "P720";
    VideoResolutions[VideoResolutions["P1080"] = 5] = "P1080";
    VideoResolutions[VideoResolutions["P1440"] = 6] = "P1440";
    VideoResolutions[VideoResolutions["P2160"] = 7] = "P2160";
})(VideoResolutions || (VideoResolutions = {}));
let errorsMessages = [];
const postVideo = (video) => {
    var _a;
    errorsMessages = [];
    strValidation(video.title, 'title', 40);
    strValidation(video.author, 'author', 20);
    (_a = !video.availableResolutions) !== null && _a !== void 0 ? _a : resolutionsValidation(video.availableResolutions);
    return errorsMessages;
};
exports.postVideo = postVideo;
const putVideo = (video) => {
    var _a;
    errorsMessages = [];
    strValidation(video.title, 'title', 40);
    strValidation(video.author, 'author', 20);
    canBeDownloaded(video.canBeDownloaded);
    minAgeRestriction(video.minAgeRestriction);
    publicationValidation(video.publicationDate, video.createdAt);
    (_a = !video.availableResolutions) !== null && _a !== void 0 ? _a : resolutionsValidation(video.availableResolutions);
    return errorsMessages;
};
exports.putVideo = putVideo;
const strValidation = (str, field, len) => {
    if (typeof str !== 'string' || str.length > len || str.length == 0) {
        errorsMessages.push({
            message: `Incorrect ${field}`,
            field: `${field}`
        });
    }
};
const resolutionsValidation = (resolutions) => {
    if (!Array.isArray(resolutions) || !resolutions.every((x) => Object.values(VideoResolutions).includes(x))) {
        errorsMessages.push({
            message: 'Available Resolutions must be an array',
            field: 'availableResolutions'
        });
    }
};
const publicationValidation = (publicationDate, createdAt) => {
    if (publicationDate && (typeof publicationDate !== 'string' || isNaN(Date.parse(publicationDate)) || Date.parse(publicationDate) < Date.parse(createdAt))) {
        errorsMessages.push({
            message: 'publicationDate must be a date format',
            field: 'publicationDate'
        });
    }
};
const canBeDownloaded = (canBeDownloaded) => {
    if (canBeDownloaded !== undefined && typeof canBeDownloaded !== 'boolean') {
        errorsMessages.push({
            message: 'Field must be a boolean',
            field: 'canBeDownloaded'
        });
    }
};
const minAgeRestriction = (minAgeRestriction) => {
    if (minAgeRestriction && (typeof minAgeRestriction !== 'number' || minAgeRestriction > 18 || minAgeRestriction < 1)) {
        errorsMessages.push({
            message: 'Min Age Restriction must be a number',
            field: 'minAgeRestriction'
        });
    }
};
