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
exports.addSuperUser = exports.authenticateAdmin = void 0;
const bcrypt_1 =require("bcrypt");
const uuid_1 = require("uuid");
const Queries_1 = require("../services/Queries");
const admins_1 = require("../models/sql/admins");
const authenticateAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.admin) {
        return next();
    }
    res.json({
        "status": "unauthorized",
        "message": "you are not logged in"
    });
});
exports.authenticateAdmin = authenticateAdmin;
function addSuperUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.SQLQuery(admins_1.AdminModel);
        const { res } = yield query.findAll();
        if ((res === null || res === void 0 ? void 0 : res.length) !== 0) {
            return "Superuser exists";
        }
        const admin = {
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD
        };
        try {
            const salt = yield bcrypt_1.default.genSalt();
            const env_password = admin.password;
            const hashed = yield bcrypt_1.hash(env_password, salt);
            yield query.createRecord({
                username: admin.username,
                password: hashed,
                admin_id: (0, uuid_1.v4)().toString().slice(0, 5),
                isSuperUser: true
            });
            return "Admin Created";
        }
        catch (error) {
            return error;
        }
    });
}
exports.addSuperUser = addSuperUser;
