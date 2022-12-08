"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Refferal = exports.Bot = exports.Investment = void 0;
const db_1 = require("../../db");
const { Model, DataTypes } = require("sequelize");
class Investment extends Model {
}
exports.Investment = Investment;
class Bot extends Model {
}
exports.Bot = Bot;
class Refferal extends Model {
}
exports.Refferal = Refferal;
Investment.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    duration: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 90,
    },
    percentage_profit: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    returns: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    bot: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, { sequelize: db_1.sequelize, tableName: "investments" });
Bot.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    bot_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bot_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bot_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    duration: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 90,
    },
    percentage_profit: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, { sequelize: db_1.sequelize, tableName: "bots" });
Refferal.init({
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
    },
    ref_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    first_gen: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    second_gen: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
}, { sequelize: db_1.sequelize, tableName: "refferals" });
