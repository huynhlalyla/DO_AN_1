const express = require('express');
const app = express();
const route = express.Router();
const multer = require('multer');
const {userRule} = require('../config/ruleRoute');
const {uploadFiles} = require('../config/uploadFiles');
// Import controller
const postController = require('../app/controllers/postController');
const session = require('express-session');

//kiểm tra đăng nhập
route.use(userRule);
// Sử dụng middleware upload.single('file') để xử lý file upload
route.post('/upload', uploadFiles, postController.upload);
route.delete('/delete/:id', postController.delete);
route.put('/edit/:id', uploadFiles, postController.edit);
route.get('/', postController.post);



module.exports = route;