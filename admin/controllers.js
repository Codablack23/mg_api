"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdmins = exports.getWithdrawals = exports.getExchanges = exports.updateExchange = exports.loginAdmin = exports.addAdmin = exports.getPayments = exports.getInvestments = exports.getUsers = void 0;
const admins_1 = require("../config/models/mongo_db/admins");
const user_1 = require("../config/models/mongo_db/user");
const Queries_1 = require("../config/services/Queries");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const payments_1 = require("../config/models/mongo_db/payments");
const bots_1 = require("../config/models/mongo_db/bots");
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const refQuery = new Queries_1.MongoQuery(bots_1.Refferral);
        const query = new Queries_1.MongoQuery(user_1.User);
        const result = {
            status: "pending",
            err: "",
        };
        try {
            const { res: users } = yield query.findAll();
            const { res: refs } = yield refQuery.findAll();
            result.status = "success";
            result.users = users.map((user) => {
                return {
                    username: user.username,
                    name: user.name,
                    phone: user.phone_no,
                    createdAt: user.createdAt,
                    ref_code: user.ref_code
                };
            });
            result.refs = refs;
        }
        catch (err) {
            result.status = 'Network Error';
            result.err = "an error occured in the server try again later";
        }
        res.json(result);
    });
}
exports.getUsers = getUsers;
function getInvestments(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.MongoQuery(bots_1.Investment);
        const result = {
            status: "pending",
            err: "",
        };
        try {
            const { res: investments } = yield query.findAll();
            result.status = "completed";
            result.investments = investments;
        }
        catch (err) {
            result.status = 'Network Error';
            result.err = "an error occured in the server try again later";
        }
        res.json(result);
    });
}
exports.getInvestments = getInvestments;
function getPayments(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.MongoQuery(payments_1.Payment);
        const result = {
            status: "pending",
            err: "",
        };
        try {
            const { res: payments } = yield query.findAll();
            result.status = "completed";
            result.payments = payments;
        }
        catch (err) {
            result.status = 'Network Error';
            result.err = "an error occured in the server try again later";
        }
        res.json(result);
    });
}
exports.getPayments = getPayments;
function addAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = {
            status: "pending",
            err: "",
        };
        const query = new Queries_1.MongoQuery(admins_1.AdminModel);
        const { username } = req.body;
        try {
            const salt = yield bcrypt_1.default.genSalt();
            const env_password = username;
            const hashed = yield bcrypt_1.default.hash(env_password, salt);
            yield query.createRecord({
                username,
                password: hashed,
                admin_id: (0, uuid_1.v4)().toString().slice(0, 5),
                isSuperUser: false
            });
            result.status = "success";
            result.message = "admin added successfully";
        }
        catch (error) {
            result.status = "failed";
            result.message = "an error occurred in our server";
        }
        res.json(result);
    });
}
exports.addAdmin = addAdmin;
function loginAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.MongoQuery(admins_1.AdminModel);
        const { username, password } = req.body;
        let result = {
            status: "",
            error: ""
        };
        try {
            const { success, res: user } = yield query.find({ username: username });
            if (success) {
                const checkDetail = yield bcrypt_1.default.compare(password, user.password);
                if (checkDetail) {
                    req.session.admin = { username };
                    req.session.admin.admin_id = user.admin_id;
                    result.status = "logged in";
                    result.admin = { username, admin_id: user.admin_id };
                }
                else {
                    result.status = "Invalid Credentials";
                    result.error = "You are not authorized";
                }
            }
            else {
                result.status = "Invalid User";
                result.error = "You are not authorized ";
            }
        }
        catch (error) {
            result.status = "Server error";
            result.error = "They must have been some issue please try again later";
        }
        res.json(result);
    });
}
exports.loginAdmin = loginAdmin;
function updateExchange(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.MongoQuery(admins_1.Exchange);
        const { rate, type, conversion } = req.body;
        console.log(req.body);
        const result = {
            status: "pending",
            error: "no response yet"
        };
        try {
            yield query.updateOne({
                rate_type: type,
                conversion: conversion
            }, {
                rate: rate
            });
            result.status = "success";
            result.error = "";
            result.message = "exchange updated successfully";
        }
        catch (error) {
            result.status = "Server Error";
            result.error = "we could not get any result due to an internal error please try again later";
        }
        res.json(result);
    });
}
exports.updateExchange = updateExchange;
function getExchanges(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.MongoQuery(admins_1.Exchange);
        const result = {
            status: "pending",
            error: "no response yet"
        };
        try {
            const { res } = yield query.findAll();
            result.error = "";
            result.status = "success";
            result.exchanges = res;
        }
        catch (error) {
            result.status = "Server Error";
            result.error = "we could not get any result due to an internal error please try again later";
        }
        res.json(result);
    });
}
exports.getExchanges = getExchanges;
function getWithdrawals(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.MongoQuery(payments_1.Withdrawal);
        const result = {
            status: "pending",
            err: "",
        };
        try {
            const { res: withdrawals } = yield query.findAll();
            result.status = "completed";
            result.withdrawals = withdrawals;
        }
        catch (err) {
            result.status = 'Network Error';
            result.err = "an error occured in the server try again later";
        }
        res.json(result);
    });
}
exports.getWithdrawals = getWithdrawals;
function getAdmins(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.MongoQuery(admins_1.AdminModel);
        const result = {
            status: "pending",
            err: "",
        };
        try {
            const { res: admins } = yield query.findAll({ isSuperUser: false });
            result.status = "completed";
            result.admins = admins.map((user) => {
                return {
                    username: user.username,
                    admin_id: user.admin_id,
                    createdAt: user.createdAt
                };
            });
        }
        catch (err) {
            result.status = 'Network Error';
            result.err = "an error occured in the server try again later";
        }
        res.json(result);
    });
}
exports.getAdmins = getAdmins;
