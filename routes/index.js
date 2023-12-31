require('dotenv').config();

let express = require('express');
let router = express.Router();
let fs = require('fs');
let path = require('path');
const basename = path.basename(__filename);
let asyncHandler = require('../middlewares/asyncHandler.middleware');

let routeModules = [];
const currentFolderPath = __dirname;

function loadModules(folderPath){
	fs
		.readdirSync(folderPath)
		.filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
		.forEach((file) => {
			let obj = require(path.join(folderPath, file));
			routeModules.push(obj);
		});
}

fs
	.readdirSync(currentFolderPath)
	.filter(folder => (folder.slice(-3) !== '.js'))
	.forEach((folder) => { 
		if (fs.existsSync(path.join(currentFolderPath, folder))) loadModules(path.join(currentFolderPath, folder))
	});

/* GET home page. */
// router.get('/', asyncHandler((req, res, next) => {
//     res.render('index', { title: process.env.APP_NAME || "Express JS" });
// }));

// routeModules.push(router);
loadModules(currentFolderPath);
module.exports = {
	routeModules
}