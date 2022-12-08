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
exports.changePassword = exports.sendResetPasswordToken = exports.registerHandler = exports.resetPassword = exports.forgotPassword = exports.logoutHandler = exports.loginHandler = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const user_1 = require("../config/models/mongo_db/user");
const Queries_1 = require("../config/services/Queries");
const bots_1 = require("../config/models/sql/bots");
function loginHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { phone, password } = req.body;
        const response = {
            status: "pending",
            error: "process is still pending"
        };
        const query = new Queries_1.SQLQuery(user_1.User);
        try {
            const userExist = yield query.find({ phone_no: phone });
            const { res: user } = userExist;
            const check = yield bcrypt_1.default.compare(password, user.password);
            if (check) {
                const userData = {
                    phone,
                    username: user.username,
                    name: user.name,
                    refcode: user.ref_code
                };
                req.session.user = userData;
                response.error = "";
                response.status = "success";
                response.user = userData;
                return res.json(response);
            }
            response.status = "not allowed";
            response.error = "password does not match";
            return res.json(response);
        }
        catch (error) {
            console.log(error);
            response.status = "internal error";
            response.error = "an internal server error occured";
        }
        res.json(response);
    });
}
exports.loginHandler = loginHandler;
function logoutHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        delete req.session.user;
        res.json({
            status: 'success',
            message: "you have successfully logged out"
        });
    });
}
exports.logoutHandler = logoutHandler;
function forgotPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.json({
            page: "logout"
        });
    });
}
exports.forgotPassword = forgotPassword;
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = {
            status: "pending",
            error: "pending process"
        };
        const { username } = req.session.user;
        const { new_password } = req.body;
        const query = new Queries_1.SQLQuery(user_1.User);
        try {
            yield query.updateOne({ username }, { password: new_password });
            response.status = "success";
            response.message = "password changed successfully";
        }
        catch (error) {
            console.log(error);
            response.status = "500";
            response.error = "an internal server occurred";
        }
        res.json(response);
    });
}
exports.resetPassword = resetPassword;
function registerHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = {
            status: "pending",
            error: "process is still pending"
        };
        const { name, phone, password, username } = req.body;
        console.log(req.body, "regHandler");
        const query = new Queries_1.SQLQuery(user_1.User);
        const refQuery = new Queries_1.SQLQuery(bots_1.Refferal);
        try {
            const salt = yield bcrypt_1.default.genSalt();
            console.log(uuid_1.v4);
            const refcode = (0, uuid_1.v4)().slice(0, 6);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            yield query.createRecord({
                name,
                phone_no: phone,
                ref: "",
                username,
                refferred: false,
                password: hashedPassword,
                ref_code: refcode,
            });
            yield refQuery.createRecord({
                ref_code: refcode,
                first_gen: "",
                second_gen: "",
                amount: 0
            });
            const user = {
                name,
                phone,
                username,
                refcode
            };
            response.status = "success";
            response.error = "";
            response.user = user;
            req.session.user = user;
        }
        catch (error) {
            console.log(error);
            response.status = "500";
            response.error = "an internal server occurred";
            return res.json(response);
        }
        res.json(response);
    });
}
exports.registerHandler = registerHandler;
function sendResetPasswordToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.json({
            page: "logout"
        });
    });
}
exports.sendResetPasswordToken = sendResetPasswordToken;
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.json({
            page: "logout"
        });
    });
}
exports.changePassword = changePassword;
