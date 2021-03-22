const multer = require('multer')
const path = require('path')
var storageFiles = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log(req.body)
        cb(null, 'upload/files')
    },
    filename: function(req, file, cb) {
        cb(null, 'file' + Date.now() + path.extname(file.originalname))
    }
})

module.exports = {
    uploadFile: multer({ storage: storageFiles }),
}