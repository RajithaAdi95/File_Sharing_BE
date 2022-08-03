const util = require("util");
const multer = require("multer");
const jwt = require('jsonwebtoken')
const path = require('path');

const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //console.log(req.body);
        let dataFromFrontend = JSON.parse(req.body.data)
        let savePath = 'uploads/' + dataFromFrontend.account.toLowerCase() + '/' + dataFromFrontend.type.toLowerCase();
        cb(null, savePath);
    },
    filename: (req, file, cb) => {
        let dataFromFrontend = JSON.parse(req.body.data)
        // console.log('Data from FRONTEND : ' + JSON.stringify(dataFromFrontend));
        // if(dataFromFrontend.account.toUpperCase() == 'users'.toUpperCase()){
        //     let token = req.headers.authorization.split(' ')[1]
        //     if(token === 'null') {
        //         return res.status(401).send('Unathorized request')
        //     }
        //     let payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        //     if(!payload){
        //         return res.status(401).send('Unathorized request')
        //     }
        //     dataFromFrontend.id = payload.userId;
        // }
        dataFromFrontend.filename = `${dataFromFrontend.account}_${dataFromFrontend.type}_${dataFromFrontend.id}${path.extname(file.originalname)}`
        req.dataFromFrontend = dataFromFrontend;
        cb(null, dataFromFrontend.filename);
    },
});

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png"){
      cb(null, true);
    } else {
        req.fileValidationError = 'Only .jpg, .jpeg and .png image files are allowed!';
        return cb(null, false, new Error('Only .jpg, .jpeg and .png image files are allowed!'));
    }
};

const uploadFile = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: maxSize },
}).single("upload_file");

// let uploadFileMiddleware = util.promisify(uploadFile);
// module.exports = uploadFileMiddleware;
module.exports = uploadFile;