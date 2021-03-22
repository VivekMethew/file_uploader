const express = require('express')
const router = express.Router()

// auth users
const { verifyAccessToken } = require('../helper/auth.users')

// Controllers
const usersController = require('../controller/users.controller')

// Middlewares
const uploadMiddleware = require('../middleware/fileupload.middleware')

// Get All users
router.get('/users', verifyAccessToken, usersController.getAllUsers)

// Get user
router.get('/users/:userid', verifyAccessToken, usersController.getUser)

// Create new user
router.post('/users', uploadMiddleware.uploadFile.single('file'), usersController.createUsers)

// update user
router.patch('/users/:id', verifyAccessToken, usersController.updateUsers)

// delete user
router.delete('/users/:id', verifyAccessToken, usersController.deleteUsers)

// login user
router.post('/users/login', usersController.user_login)


module.exports = router