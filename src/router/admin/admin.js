const express = require('express');
const route = express.Router();
const app = express();
const {adminRule} = require('../../config/ruleRoute');

const adminController = require('../../app/controllers/admin/adminController');
route.get('/logout', adminController.logout);
//dùng middleware để kiểm tra phiên đăng nhập
route.use(adminRule);
route.get('/post', adminController.post);
route.get('/postAdmin', adminController.postAdmin);
route.get('/postAdmin/:slug', adminController.postAdminSearch);
route.get('/postManage', adminController.postManage);
route.get('/postManage/:slug', adminController.postSearch);
route.delete('/postManage/:id', adminController.postDelete);
route.get('/userManage', adminController.userManage);
route.get('/userManage/:slug', adminController.userSearch);
route.put('/userManage/:slug', adminController.userOption);
route.get('/stored', adminController.stored);
route.get('/', adminController.home);

//resrful api
//get - lấy dữ liệu
//post - thêm dữ liệu
//put - cập nhật dữ liệu
//patch - cập nhật dữ liệu
//delete - xóa dữ liệu

module.exports = route;