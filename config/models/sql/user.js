"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetCode = exports.User = void 0;
const db_1 = require("../../db");
const { Model, DataTypes } = require('sequelize');
const moment = require("moment");
class User extends Model {
}
exports.User = User;
class ResetCode extends Model {
}
exports.ResetCode = ResetCode;
const current_date = new Date();
const expires = moment(current_date).add(30, "m").toDate();
User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.TEXT,
    },
    username: {
        type: DataTypes.STRING,
    },
    phone_no: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    ref_code: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
    },
    reffered: {
        type: DataTypes.BOOLEAN,
    },
    ref: {
        type: DataTypes.TEXT,
        defaultValue: ""
    }
}, { sequelize: db_1.sequelize, tableName: "users" });
ResetCode.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.STRING
    },
    code: {
        type: DataTypes.STRING,
        unique: true
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: expires
    },
    username: {
        type: DataTypes.STRING,
    },
}, { sequelize: db_1.sequelize, tableName: "reset_codes" });
