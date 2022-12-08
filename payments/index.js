"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = require("../config/middlewares/userAuth");
const controllers_1 = require("./controllers");
const paymentApp = express_1.default.Router();
paymentApp.post("/", userAuth_1.authenticate, controllers_1.getWithdrawals);
paymentApp.post("/withdraw", userAuth_1.authenticate, controllers_1.makeWithdrawal);
exports.default = paymentApp;
