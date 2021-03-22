const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema


const userSchema = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    filetype: {
        type: String,
        default: null
    },
    filename: {
        type: String,
        default: null
    },
    filepath: {
        type: String,
        default: null
    },
    status: {
        type: Number,
        default: 1
    }
}, { createdAt: true, updatedAt: true })

// hash password before saving to database
userSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(this.password, salt)
        this.password = hashPassword
        next()
    } catch (error) {
        next(error);
    }
});

// validate Password
userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const User = mongoose.model('users', userSchema)

module.exports = { User }