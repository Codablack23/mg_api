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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = void 0;
const user_1 = require("../models/mongo_db/user");
const Queries_1 = require("../services/Queries");
function findUser(route) {
    if (route === "login") {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { phone } = req.body;
            const query = new Queries_1.MongoQuery(user_1.User);
            try {
                const userExist = yield query.find({ phone_no: phone });
                if (userExist.res) {
                    return next();
                }
                res.json({
                    status: "404",
                    error: "user does not exist"
                });
            }
            catch (error) {
                console.log(error);
                res.json({
                    status: "internal server error",
                    error: "an internal server error occured"
                });
            }
        });
    }
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const { phone: phone_no, username } = req.body;
        console.log(req.body);
        const query = new Queries_1.MongoQuery(user_1.User);
        try {
            const userExist = yield query.find({ $or: [{ phone_no }, { username }] });
            if (!userExist.res) {
                return next();
            }
            res.json({
                status: "405",
                error: "user already exist try a different phone number or username"
            });
        }
        catch (error) {
            console.log(error);
            res.json({
                status: "internal server error",
                error: "an internal server error occured"
            });
        }
    });
}
exports.findUser = findUser;
