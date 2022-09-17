const express = require('express');
const Users = require('../../models/users-model/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../../middleware/auth');
const { loginValidator, registerValidator } = require("../../verification/varify");

const router = express.Router();

// logical implementation of "login" route

router.post('/login', (req, res) => {
    const { errors, isValid } = loginValidator(req.body);
    if (!isValid) {
        res.json({ success: false, errors });
    } else {
        Users.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                res.json({ message: 'Email does not exist', success: false });
            } else {
                bcrypt.compare(req.body.password, user.password).then(success => {
                    if (!success) {
                        res.json({ message: 'Invalid password', success: false });
                    } else {
                        const payload = {
                            id: user._id,
                            name: user.firstName
                        }
                        jwt.sign(
                            payload,
                            process.env.APP_SECRET, { expiresIn: 2155926 },
                            (err, token) => {
                                res.json({
                                    user,
                                    token: 'Bearer token: ' + token,
                                    success: true
                                })
                            }
                        )
                    }
                })
            }
        })
    }
})

//logical implementation of "signup" routes

router.post('/register', (req, res) => {
    const { errors, isValid } = registerValidator(req.body);
    if (!isValid) {
        res.json({ success: false, errors });
    } else {
        const { firstName, lastName, email, password } = req.body;
        const registerUser = new Users({
            firstName,
            lastName,
            email,
            password,
            createdAt: new Date()
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(registerUser.password, salt, (hashErr, hash) => {
                if (err || hashErr) {
                    res.json({ message: 'Error occured hasing', success: false });
                    return;
                }
                registerUser.password = hash;
                registerUser.save().then(() => {
                    res.json({ "message": "User created successfully", "success": true });
                }).catch(er => res.json({ message: er.message, success: false }));
            })
        })
    }
})

module.exports = router;