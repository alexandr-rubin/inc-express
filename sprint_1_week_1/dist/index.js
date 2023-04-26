"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
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
var VideobleResolutions;
(function (VideobleResolutions) {
    VideobleResolutions[VideobleResolutions["P144"] = 0] = "P144";
    VideobleResolutions[VideobleResolutions["P240"] = 1] = "P240";
    VideobleResolutions[VideobleResolutions["P360"] = 2] = "P360";
    VideobleResolutions[VideobleResolutions["P480"] = 3] = "P480";
    VideobleResolutions[VideobleResolutions["P720"] = 4] = "P720";
    VideobleResolutions[VideobleResolutions["P1080"] = 5] = "P1080";
    VideobleResolutions[VideobleResolutions["P1440"] = 6] = "P1440";
    VideobleResolutions[VideobleResolutions["P2160"] = 7] = "P2160";
})(VideobleResolutions || (VideobleResolutions = {}));
app.delete('/videos', (req, res) => {
    videos = [];
    res.status(204).send('All data is deleted');
});
app.get('/videos', (req, res) => {
    res.status(200).send(videos);
});
app.post('/videos', (req, res) => {
    const createdDate = new Date().toISOString();
    const publication = new Date(createdDate);
    publication.setDate(publication.getDate() + 1);
    const newVideo = {
        id: videos[videos.length - 1].id + 1,
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
    if (typeof newVideo.title !== 'string') {
        res.status(400).send({
            errorMessage: [{
                    message: 'Title must be a string',
                    field: 'title'
                }]
        });
        return;
    }
    if (typeof newVideo.author !== 'string') {
        res.status(400).send({
            errorMessage: [{
                    message: 'Author must be a string',
                    field: 'author'
                }]
        });
        return;
    }
    if (!Array.isArray(newVideo.availableResolutions) || !newVideo.availableResolutions.every(x => Object.values(VideobleResolutions).includes(x))) {
        res.status(400).send({
            errorMessage: [{
                    message: 'Available Resolutions must be an array',
                    field: 'availableResolutions'
                }]
        });
        return;
    }
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
app.get('/videos/:id', (req, res) => {
    const video = videos.find(x => x.id === +req.params.id);
    if (video) {
        res.status(200).send(video);
    }
    else {
        res.status(404).send('Video not found');
    }
});
app.put('/videos/:id', (req, res) => {
    var _a, _b, _c, _d;
    const video = videos.find(x => x.id === +req.params.id);
    if (!video) {
        res.status(404).send('Video not found');
        return;
    }
    if (typeof req.body.title !== 'string') {
        res.status(400).send({
            errorMessage: [{
                    message: 'Title must be a string',
                    field: 'title'
                }]
        });
        return;
    }
    if (typeof req.body.author !== 'string') {
        res.status(400).send({
            errorMessage: [{
                    message: 'Author must be a string',
                    field: 'author'
                }]
        });
        return;
    }
    if (typeof req.body.canBeDownloaded !== 'boolean' && req.body.canBeDownloaded) {
        res.status(400).send({
            errorMessage: [{
                    message: 'Field must be a boolean',
                    field: 'canBeDownloaded'
                }]
        });
        return;
    }
    if (req.body.minAgeRestriction && (typeof req.body.title.minAgeRestriction !== 'number' || req.body.title.minAgeRestriction > 18 || req.body.title.minAgeRestriction < 1)) {
        res.status(400).send({
            errorMessage: [{
                    message: 'Min Age Restriction must be a number',
                    field: 'minAgeRestriction'
                }]
        });
        return;
    }
    if (req.body.publicationDate && (typeof req.body.publicationDate !== 'string' || isNaN(Date.parse(req.body.title.publicationDate)) || Date.parse(req.body.title.publicationDate) < Date.parse(req.body.title.createdAt))) {
        res.status(400).send({
            errorMessage: [{
                    message: 'publicationDate must be a date format',
                    field: 'publicationDate'
                }]
        });
        return;
    }
    if (!Array.isArray(req.body.availableResolutions) || !req.body.availableResolutions.every(x => Object.values(VideobleResolutions).includes(x))) {
        res.status(400).send({
            errorMessage: [{
                    message: 'Available Resolutions must be an array',
                    field: 'availableResolutions'
                }]
        });
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
app.get('/videos/:id', (req, res) => {
    const video = videos.find(x => x.id === +req.params.id);
    if (video) {
        res.status(200).send(video);
    }
    else {
        res.status(404).send('Video not found');
    }
});
app.delete('/videos/:id', (req, res) => {
    const video = videos.filter(x => x.id !== +req.params.id);
    if (video.length < videos.length) {
        videos = video;
        res.status(204).send(video);
    }
    else {
        res.status(404).send('Video not found');
    }
});
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
