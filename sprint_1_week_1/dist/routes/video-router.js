"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingVideosRouter = exports.videosRouter = void 0;
const express_1 = require("express");
exports.videosRouter = (0, express_1.Router)({});
exports.testingVideosRouter = (0, express_1.Router)({});
let videos = [
    {
        "id": 0,
        "title": "title 1",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2023-04-25T14:38:03.936Z",
        "publicationDate": "2023-04-25T14:38:03.936Z",
        "availableResolutions": [
            "P144"
        ]
    },
    {
        "id": 1,
        "title": "title 2",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2023-03-10T14:38:03.936Z",
        "publicationDate": "2023-04-25T14:38:03.936Z",
        "availableResolutions": [
            "P240"
        ]
    },
    {
        "id": 2,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2022-02-17T14:38:03.936Z",
        "publicationDate": "2023-04-25T14:38:03.936Z",
        "availableResolutions": [
            "P1080"
        ]
    }
];
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
exports.testingVideosRouter.delete('/', (req, res) => {
    videos = [];
    res.status(204).send('All data is deleted');
});
exports.videosRouter.get('/', (req, res) => {
    res.status(200).send(videos);
});
exports.videosRouter.post('/', (req, res) => {
    errorsMessages = [];
    const createdDate = new Date().toISOString();
    const publication = new Date(createdDate);
    publication.setDate(publication.getDate() + 1);
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdDate,
        publicationDate: publication.toISOString(),
        availableResolutions: req.body.availableResolutions || [
            "P144"
        ]
    };
    if (typeof newVideo.title !== 'string' || newVideo.title.length > 40) {
        errorsMessages.push({
            message: 'Title must be a string',
            field: 'title'
        });
    }
    if (typeof newVideo.author !== 'string' || newVideo.author.length > 20) {
        errorsMessages.push({
            message: 'Author must be a string',
            field: 'author'
        });
    }
    if (!Array.isArray(newVideo.availableResolutions) || !newVideo.availableResolutions.every(x => Object.values(VideoResolutions).includes(x))) {
        errorsMessages.push({
            message: 'Available Resolutions must be an array',
            field: 'availableResolutions'
        });
    }
    if (errorsMessages.length > 0) {
        res.status(400).send({ errorsMessages });
        return;
    }
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.videosRouter.get('/:id', (req, res) => {
    const video = videos.find(x => x.id === +req.params.id);
    if (video) {
        res.status(200).send(video);
    }
    else {
        res.status(404).send('Video not found');
    }
});
exports.videosRouter.put('/:id', (req, res) => {
    var _a, _b, _c, _d;
    errorsMessages = [];
    const video = videos.find(x => x.id === +req.params.id);
    if (!video) {
        res.status(404).send('Video not found');
        return;
    }
    if (typeof req.body.title !== 'string' || req.body.title.length > 40) {
        errorsMessages.push({
            message: 'Title must be a string',
            field: 'title'
        });
    }
    if (typeof req.body.author !== 'string' || req.body.author.length > 20) {
        errorsMessages.push({
            message: 'Author must be a string',
            field: 'author'
        });
    }
    if (typeof req.body.canBeDownloaded !== 'boolean' && req.body.canBeDownloaded) {
        errorsMessages.push({
            message: 'Field must be a boolean',
            field: 'canBeDownloaded'
        });
    }
    if (req.body.minAgeRestriction && (typeof req.body.minAgeRestriction !== 'number' || req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1)) {
        errorsMessages.push({
            message: 'Min Age Restriction must be a number',
            field: 'minAgeRestriction'
        });
    }
    if (req.body.publicationDate && (typeof req.body.publicationDate !== 'string' || isNaN(Date.parse(req.body.publicationDate)) || Date.parse(req.body.publicationDate) < Date.parse(req.body.createdAt))) {
        errorsMessages.push({
            message: 'publicationDate must be a date format',
            field: 'publicationDate'
        });
    }
    if (!Array.isArray(req.body.availableResolutions) || !req.body.availableResolutions.every((x) => Object.values(VideoResolutions).includes(x))) {
        errorsMessages.push({
            message: 'Available Resolutions must be an array',
            field: 'availableResolutions'
        });
    }
    if (errorsMessages.length > 0) {
        res.status(400).send({ errorsMessages });
        return;
    }
    video.title = req.body.title;
    video.author = req.body.author;
    video.availableResolutions = (_a = req.body.availableResolutions) !== null && _a !== void 0 ? _a : video.availableResolutions;
    video.canBeDownloaded = (_b = req.body.canBeDownloaded) !== null && _b !== void 0 ? _b : video.canBeDownloaded;
    video.minAgeRestriction = (_c = req.body.minAgeRestriction) !== null && _c !== void 0 ? _c : video.minAgeRestriction;
    video.publicationDate = (_d = req.body.publicationDate) !== null && _d !== void 0 ? _d : video.publicationDate;
    res.status(204).send(video);
});
exports.videosRouter.get('/:id', (req, res) => {
    const video = videos.find(x => x.id === +req.params.id);
    if (video) {
        res.status(200).send(video);
    }
    else {
        res.status(404).send('Video not found');
    }
});
exports.videosRouter.delete('/:id', (req, res) => {
    const video = videos.filter(x => x.id !== +req.params.id);
    if (video.length < videos.length) {
        videos = video;
        res.status(204).send(video);
    }
    else {
        res.status(404).send('Video not found');
    }
});
