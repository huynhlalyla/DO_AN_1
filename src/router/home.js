const express = require('express');
const route = express.Router();
const {userRule} = require('../config/ruleRoute');
const homeController = require('../app/controllers/homeController');

route.get('/search', homeController.search);
route.get('/', homeController.home);

route.use(userRule);
route.get('/posts', homeController.posts);
module.exports = route;