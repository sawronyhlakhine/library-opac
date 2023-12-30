'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require('../configs/db.config')[process.env.NODE_ENV ?? "development"];
const basename = path.basename(__filename);
const MODEL_DIR = path.join(__dirname, '../models')
let db = {};

const debugInfo = require('debug')('project:info');
const debugErr = require('debug')('project:err');

const sequelize = new Sequelize(dbConfig.DB_NAME, dbConfig.DB_USER, dbConfig.DB_PASS, {
	dialect: dbConfig.DB_DRIVER,
	host: dbConfig.DB_HOST,
	port: dbConfig.DB_PORT,
});

fs
	.readdirSync(MODEL_DIR)
	.filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
	.forEach(file => {
		let model = require(path.join(MODEL_DIR, file))(sequelize, DataTypes);
		db[model.name] = model;
	});

Object
	.keys(db)
	.forEach(modelName => {
		if (db[modelName].associate)
			db[modelName].associate(db)
	});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const checkConnection = async () => {
	try {
		await sequelize.authenticate();
		debugInfo(`DB Connected Successfuly`);
	} catch (error) {
		debugErr(`Unable to connect to the database: `, error);
	}
};
checkConnection();

module.exports.db = db;