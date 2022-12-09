"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv").config();
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    db: process.env.DB_NAME,
    environment: process.env.ENV
};
const db = {
    dialect: "mysql",
    host: "localhost"
};
exports.sequelize = new Sequelize('magtech', dbConfig.user, dbConfig.password, db);
