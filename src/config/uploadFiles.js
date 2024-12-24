const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });
module.exports = {
    uploadFile: upload.single('file'),
    uploadFiles: upload.fields([
        { name: 'thumnail', maxCount: 1 },
        { name: 'file' }
    ])
}