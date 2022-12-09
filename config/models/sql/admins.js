"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const { Model, DataTypes } = require("sequelize");
class Admin extends Model {
}
class Exchange extends Model {
}
Admin.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    admin_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    isSuperUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { sequelize: db_1.sequelize, tableName: "admins" });
Exchange.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.00
    },
    conversion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rate_type: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, { sequelize: db_1.sequelize, tableName: "exchange_rates" });
module.exports = {
    Admin,
    Exchange
};
