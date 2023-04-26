"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Video_1 = require("../validators/Video");
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
        id: 123,
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: req.body.canBeDownloaded || false,
        minAgeRestriction: req.body.minAgeRestriction || null,
        createdAt: createdDate,
        publicationDate: req.body.publicationDate || publication.toISOString(),
        availableResolutions: req.body.availableResolutions || [
            "P144"
        ]
    };
    if (Object.values((0, Video_1.validator)(newVideo)).length > 0) {
        res.status(400).send((0, Video_1.validator)(newVideo));
    }
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
