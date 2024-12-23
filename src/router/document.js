const express = require('express');
const route = express.Router();
const documentController = require('../app/controllers/documentController');

route.get('/view-all', documentController.viewAll);
route.get('/:type', documentController.viewOnly); 
route.get('/view/:id', documentController.document);

module.exports = route;