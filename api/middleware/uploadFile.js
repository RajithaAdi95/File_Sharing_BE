const util = require("util");
const multer = require("multer");
const jwt = require('jsonwebtoken')
const path = require('path');

const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dataFromFrontend = JSON.parse(req.body.data)
        let savePath = 'uploads/';
        cb(null, savePath);
    },
    filename: (req, file, cb) => {
        let dataFromFrontend = JSON.parse(req.body.data)
        dataFromFrontend.filename = `${path.extname(file.originalname)}`
        req.dataFromFrontend = dataFromFrontend;
        cb(null, dataFromFrontend.filename);
    },
});

const uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("upload_file");

module.exports = uploadFile;