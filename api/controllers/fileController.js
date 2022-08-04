const uploadFile = require("../middleware/uploadFile");
// const uploadFiles3 = require("../middleware/uploads3");
// const deleteFiles3 = require("../middleware/deletes3");
const fs = require('fs');
// const User = require('../models/user')
// const path = require('path');
// const TournamentProfile = require("../models/tournament");
// const TeamProfile = require("../models/teamProfile");
// const GamerProfile = require("../models/gamerProfile");
// const Game = require("../models/game");
const sharp = require('sharp');

const updateDBonImageUpload = async (req, res) => {
    var relevantProfile;
    var updateData = {};
    
    // req.dataFromFrontend.account.toUpperCase() == 'users'.toUpperCase() ? 
    // relevantProfile = User : req.dataFromFrontend.account.toUpperCase() == 'tournaments'.toUpperCase() ? 
    // relevantProfile = TournamentProfile : req.dataFromFrontend.account.toUpperCase() == 'teams'.toUpperCase() ? 
    // relevantProfile = TeamProfile : req.dataFromFrontend.account.toUpperCase() == 'games'.toUpperCase() ? 
    // relevantProfile = Game : req.dataFromFrontend.account.toUpperCase() == 'gamerprofiles'.toUpperCase() ? 
    // relevantProfile = GamerProfile : res.status(404).send({message: "Image uploaded but not stored the path in DB. Account is invalid"});

    relevantProfile.find({_id: req.dataFromFrontend.id})
    .then(result => {
        if(result.length){
            let savePath = 'uploads/' + Date.now().toString();
            fs.unlink(savePath, (err) => {
                if (err) {
                    console.log("error in deleting previous image : " + err);
                } else {
                    console.log('Previously uploaded image deleted.');                                
                }
            });

            relevantProfile.updateOne({ _id: req.dataFromFrontend.id }, { $set : updateData}).then(
            (mem) => {
                console.log("Uploaded the file successfully: " + req.file.originalname)
                res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname,
                    data: mem
                });
            }).catch((error) => {
                console.log("error: " + error)
                res.status(400).send(error);
            });
        } else {
            res.status(409).send("Relevant Profile Not found");
        }
    }).catch(err => {
        res.status(400).send("Error in finding relevant profile : " + err);
    })
}

exports.upload = async (req, res) => {
    sharp.cache(false);
    uploadFiles3(req, res, async function (err) {
        if (err) {
            if (err.code == "LIMIT_FILE_SIZE") {
                return res.status(500).send({
                    message: "File size cannot be larger than 2MB!",
                });
            }
            else if (req.file == undefined) {
                return res.status(500).send({ message: "Please upload a file!" });
            }
            res.status(500).send({
                message: `Could not upload the file. ${err}`,
            });
        }
        else {
            console.log(req.file);
            if (req.fileValidationError) {
                console.log('req.fileValidationError : ' + JSON.stringify(req.fileValidationError));
                return res.status(500).send(req.fileValidationError);
            }

            console.log('req.file.path : ' + req.file.key);
            sharp(req.file.key)
            .toBuffer().then(data => {
                fs.writeFile(req.file.key, data, (error) => {
                    if(error) {
                        console.log('error in writing : ' + error);
                    } else {
                        console.log('WRITING COMPLETE')
                    }
                })
            }).catch(err => {
                console.log('sharp err : ' + err);
            });
        
            if (req.body.data.context != "social"){
                await updateDBonImageUpload(req, res);
            }
        }
    })
};

exports.download = (req, res) => {
    const directoryPath = `uploads/${fileName}`;

    res.download(directoryPath, fileName, (err) => {
        if (err) {
            res.status(500).send({message: "Could not download the image : " + err});
        }
    });
};

exports.deleteFile = async (req, res) => {
    deleteFiles3(req,res,async function(err,data){
        if(err){
            res.status(500).send("Failed!");
        }
        else{
            res.status(200).send("Success!");
        }
    })
};