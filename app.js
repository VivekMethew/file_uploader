require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

// routes
const userRoutes = require('./routes/users.routes')


const app = express()

const PORT = process.env.PORT || 5000

// mongoose connection
require('./config/connection')();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// static paths
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type,token,Accept, Authorization')
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        return res.status(200).json({})
    }
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
});


app.use((req, res, next) => {
    next(createError(404, "Not Found Route"))
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})


app.use(userRoutes)

app.listen(PORT, () => {
    console.log('Running on server ', PORT)
})