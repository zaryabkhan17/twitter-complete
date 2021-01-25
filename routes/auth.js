var express = require('express');
var bcrypt = require('bcrypt-inzi');
var jwt = require('jsonwebtoken');

var { SERVER_SECRET} = require("../core/index")


 
var { userModel} = require("../dbrepo/models");
console.log("userModels: ", userModel)

var router = express.Router();

router.post("/signup", (req, res, next) => {

    if (
        !req.body.name
        || !req.body.email
        || !req.body.phone
        || !req.body.password
    ) {

        res.status(403).send(`
            please send name, email and passwod  in json body.
            e.g:
            {
                "name": "zar",
                "email": "zar@gmail.com",
                "phone": "123456789",
                "password": "1111",
            }`)
        return;
    }
    console.log(req.body);
    userModel.findOne({ email: req.body.email },
        function (err, doc) {
            if (!err && !doc) {
                bcrypt.stringToHash(req.body.password).then(function (hash) {
                    var newUser = new userModel({
                        "name": req.body.name,
                        "email": req.body.email,
                        "phone": req.body.phone,
                        "password": hash,
                    })

                    newUser.save((err, data) => {
                        if (!err) {
                            res.send({
                                message: "user created"
                            })
                        } else {
                            console.log(err)
                            res.status(500).send({
                                message: "user created error, " + err
                            })
                        }
                    });
                })
            }
            else if (err) {
                res.status(500).send({
                    message: "db error"
                })
            }
            else {
                res.status(408).send({
                    message: "user already exist"
                })
            }
        }
    )





})


router.post("/login", (req, res, next) => {

    if (!req.body.email || !req.body.password) {
        res.status(403).send(`
            please send email and password in json body.
            e.g:
            {
                "email": zar@gamil.com,
                "password": abc
            }
        `)
        return;
    }

    userModel.findOne({ email: req.body.email },
        function (err, user) {
            if (err) {
                res.status(500).send({
                    message: "an error occured; " + JSON.stringify(err)
                });

            } else if (user) {
                bcrypt.varifyHash(req.body.password, user.password).then(isMatched => {
                    if (isMatched) {
                        console.log("matched");
                        var token = jwt.sign({
                            id: user._id,
                            name: user.name,
                            email: user.email,
                        }, SERVER_SECRET)

                        res.cookie('jToken', token, {
                            maxAge: 86_400_000,
                            httpOnly: true
                        })

                        res.send({
                            message: "login success",
                            user: {
                                name: user.name,
                                email: user.email,

                            }
                        })


                    } else {
                        console.log("not matched");
                        res.status(401).send({
                            message: "incorrect password"
                        })
                    }
                }).catch(e => {
                    console.log("error: ", e);
                })

            } else {
                res.status(403).send({
                    message: "user not found"
                })
            }
        }
    )
})
router.post("/logout", (req, res, next) => {
    res.cookie('jToken', "", {
        maxAge: 86_400_000,
        httpOnly: true
    });
    res.send("logout success");
});

module.exports = router;