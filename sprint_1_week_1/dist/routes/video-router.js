"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingVideosRouter = exports.videosRouter = void 0;
const express_1 = require("express");
const Video_1 = require("../validation/Video");
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
exports.testingVideosRouter.delete('/', (req, res) => {
    videos = [];
    res.status(204).send('All data is deleted');
});
exports.videosRouter.get('/', (req, res) => {
    res.status(200).send(videos);
});
exports.videosRouter.post('/', (req, res) => {
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
    const validationResult = (0, Video_1.postVideo)(newVideo);
    if (validationResult.length > 0) {
        res.status(400).send({ validationResult });
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
    const video = videos.find(x => x.id === +req.params.id);
    if (!video) {
        res.status(404).send('Video not found');
        return;
    }
    const validationResult = (0, Video_1.putVideo)(req.body);
    if (validationResult.length > 0) {
        res.status(400).send({ validationResult });
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
