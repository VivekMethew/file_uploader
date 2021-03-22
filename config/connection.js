const mongoose = require('mongoose');
module.exports = () => {
    mongoose.connect(process.env.CONNECTION_STRING, {
        dbName: process.env.DBNAME,
        user: process.env.USER,
        pass: process.env.PASS,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => {
        console.log('mongodb connected...')
    }).catch(err => console.log(err.message))

    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to db...')
    })

    mongoose.connection.on('error', (err) => {
        console.log(err.message)
    })

    mongoose.connection.on('disconnected', (err) => {
        console.log('Mongoose connection is disconnected...')
    })

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose connection is disconnected due to app termination...')
        })
    })
}