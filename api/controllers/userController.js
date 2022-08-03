const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// user signup
exports.user_signup = (req, res, next) => {
    console.log('body ', req.body)
    User.find({ user_name: req.body.user_name })
    .then(u_data => {
        if(u_data.length) {
            return res.status(409).json({
                success: false,
                message: "Username already exist"
            });
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                else {
                    var token = jwt.sign({ user_name: req.body.user_name }, process.env.ACCESS_TOKEN_SECRET);
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        user_name: req.body.user_name,
                        email: req.body.email,
                        password: hash,
                        temporaryToken: token,
                        first_name: "",
                        last_name: "",
                        phone_num: "",
                        country: "",
                        created_at: new Date()
                    });
                    user.save()
                    .then(result => {
                        res.status(201).json({
                            success: true,
                            message: "User created successfully!!!"
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({
                            error: error
                        });
                    })
                }
            })
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    })
}

// user signin
exports.user_login = (req, res, next) => {
    User.find({ user_name: req.body.user_name })
    .then(u_data => {
        if(u_data.length < 1) {
            return res.status(401).json({
                message: "Couldn't find that user! Please try again",
                success: false
            });
        }
        else {
            bcrypt.compare(req.body.password, u_data[0].password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: "Authentication failed"
                    });
                }
                if(result) {
                    const token = jwt.sign({user_name: u_data[0].user_name, user_id: u_data[0]._id}, process.env.ACCESS_TOKEN_SECRET);
                    return res.status(200).json({
                        message: "Authentication successful",
                        token: token,
                        success: true,
                        userId: u_data[0]._id
                    });
                }
                else {
                    return res.status(401).json({
                        message: "Couldn't find that user! Please try again",
                        success: false
                    });
                }
            })
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    })
}

// verify token
exports.auth_token = (req, res, next) => {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(user);

    const user_name = user.user_name;
    User.findOne({ user_name: user_name })
    .then((data) => {
        res.send({ status: "ok", user_id: data._id });
    })
    .catch((error) => {
        res.send({ status: "error", data: error });
    });
};

// get user details
exports.get_user = (req, res, next) => {
    User.findById(req.params.id) //filters the user by Id
    .then(result => {
      res.send(result);
    }).catch(err => {
      res.status(400).send("Something went wrong." + err);
    })
}

// update user details
exports.update_user = (req, res, next) => {
    User.find({ _id: req.params.id })
    .exec()
    .then(user => {
        if (user.length) {
            const userD = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                user_name: req.body.user_name,
                phone_num: req.body.phone_num,
                country: req.body.country,
                email: req.body.email,
            });
            User.updateOne({ _id: req.params.id }, userD).then(() => {
                res.status(201).json({
                    message: 'User updated successfully!',
                    success: true
                });
            })
            .catch((error) => {
                res.status(400).json({
                    error: error
                });
            });
        } else {
            return res.status(409).json({
                message: "User not found"
            });
        }
    });
}