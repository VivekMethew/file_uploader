const { User } = require('../modal/users.modal')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const createError = require('http-errors')
const { signAccessToken } = require('../helper/auth.users')
const mongoose = require('mongoose')

module.exports = {
    getAllUsers: async(req, res, next) => {
        try {
            const users = await User.find({}, { __v: 0 })
            if (!users) {
                throw createError(404, 'Users does not exists')
            }
            res.status(200).json({
                success: true,
                user: users
            })
        } catch (error) {
            if (error instanceof mongoose.CastError) {
                next(createError(400, 'something wrong'))
                return
            }
            next(error)
        }
    },
    getUser: async(req, res, next) => {
        console.log(req.params.userid)
        try {
            const user = await User.findById(req.params.userid, { __v: 0 })
            if (!user) {
                throw createError(404, 'User does not exists')
            }
            res.status(200).json({
                success: true,
                user: user
            })
        } catch (error) {
            // console.log(error)
            if (error instanceof mongoose.CastError) {
                next(createError(400, 'Invalid user id'))
                return
            }
            next(error)
        }
    },
    createUsers: async(req, res, next) => {
        console.log(req.file)
        await sharp(`./upload/files/${req.file.filename}`)
            .resize(1000, 1000, {
                fit: 'cover',
                width: 500,
                height: 500
            })
            .toBuffer()
            .then(data => {
                console.log(data)
                const user = new User({
                    fname: req.body.fname,
                    lname: req.body.fname,
                    email: req.body.fname,
                    password: req.body.fname,
                    phone: req.body.fname
                })
                user.save().then(() => {
                    // console.log(user)
                    return res.status(201).send({
                        success: false,
                        message: 'success',
                        user: user
                    })
                }).catch((err) => {
                    return res.status(500).send({
                        success: false,
                        message: err.message
                    })
                })
            })
    },
    deleteUsers: async(req, res, next) => {
        try {
            const result = await User.findByIdAndDelete(req.params.id)
            if (!result) {
                throw createError(404, 'Not Found User')
            }
            res.status(200).json({
                success: true,
                result: result
            })
        } catch (error) {
            // console.log(error)
            if (error instanceof mongoose.CastError) {
                next(createError(400, 'something wrong'))
                return
            }
            next(error)
        }
    },
    updateUsers: async(req, res, next) => {
        try {
            const id = req.params.id
            const updates = req.body
            const options = { new: true }
            const update = await User.findByIdAndUpdate(id, updates, options)
            if (!update) {
                throw createError(404, 'Not Found')
            }
            res.status(200).json({
                success: true,
                update: update
            })
        } catch (error) {
            if (error instanceof mongoose.CastError) {
                next(createError(400, 'something wrong'))
                return
            }
            next(error)
        }
    },
    user_login: async(req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body)
            const user = await User.findOne({ email: result.email })
            if (!user) throw createError.NotFound('User not registered')

            const isMatch = await user.isValidPassword(result.password)
            if (!isMatch) throw createError.Unauthorized('Username/password not valid')

            const accessToken = await signAccessToken(user.id)
            const refreshToken = await signRefreshToken(user.id)
            res.send({ accessToken, refreshToken })
        } catch (err) {
            if (err.isJoi === true)
                return next(createError.BadRequest("Invalide username/password"))
            next(err)
        }
    }
}