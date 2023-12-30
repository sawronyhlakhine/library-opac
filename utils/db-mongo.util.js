require('dotenv').config()
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const fs = require('fs');
const path = require('path');
const dbConfig = require('../configs/db.config')[process.env.NODE_ENV ?? "development"];
const MODEL_DIR = path.join(__dirname, '../models');
const basename = path.basename(__filename);
let db = {};

let dbHost = process.env.DB_HOST || dbConfig.DB_HOST,
    dbPort = process.env.DB_PORT || dbConfig.DB_PORT,
    dbName = process.env.DB_DATABASE || dbConfig.DB_DATABASE,
    dbConnection = process.env.DB_CONNECTION || dbConfig.DB_DRIVER,
    dbUserName = encodeURIComponent(process.env.DB_USERNAME || dbConfig.DB_USERNAME),
    dbPwd = encodeURIComponent(process.env.DB_PASSWORD || dbConfig.DB_PASSWORD),
    useAuth = process.env.DB_USE_AUTH || 1;

let url;
if (parseInt(useAuth))
    url = `${dbConnection}://${dbUserName}:${dbPwd}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
else
    url = `${dbConnection}://${dbHost}:${dbPort}/${dbName}`;

const dbConnect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

fs
	.readdirSync(MODEL_DIR)
	.filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
	.forEach(file => {
		let model = require(path.join(MODEL_DIR, file));
		db[file.split('.')[0]] = model;
	});

const checkConnection = async () => {
    dbConnect.then(() => {
        console.log("Database connected successfully.")
    }).catch(err => {
        console.log("Database Can Not Connect", err);
    })
};
checkConnection();

db.mongoose = mongoose;

module.exports.db = db;