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
exports.addUserWithRefCode = exports.checkRef = void 0;
const user_1 = require("../models/mongo_db/user");
const Queries_1 = require("../services/Queries");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const bots_1 = require("../models/sql/bots");
function checkRef(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { refcode } = req.body;
        if (!refcode) {
            return next();
        }
        const query = new Queries_1.SQLQuery(user_1.User);
        const { success } = yield query.find({ ref_code: refcode });
        if (success) {
            return next();
        }
        res.json({
            status: "404",
            error: "the refcode is invalid"
        });
    });
}
exports.checkRef = checkRef;
function addUserWithRefCode(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //default response object
        const response = {
            status: "pending",
            error: "process is still pending",
        };
        const { name, phone, password, username, refcode: ref } = req.body;
        const query = new Queries_1.SQLQuery(user_1.User);
        const refQuery = new Queries_1.SQLQuery(bots_1.Refferal);
        if (!ref) {
            return next();
        }
        try {
            const salt = yield bcrypt_1.default.genSalt();
            const refcode = (0, uuid_1.v4)().slice(0, 6);
            yield query.createRecord({
                name,
                phone_no: phone,
                username,
                password: yield bcrypt_1.default.hash(password, salt),
                ref_code: refcode,
                ref
            });
            //add user as first_gen to the one who reffered him 
            yield refQuery.createRecord({
                ref_code: ref,
                first_gen: username,
                second_gen: "",
                amount: 0
            });
            const user = {
                name,
                phone,
                username,
                refcode
            };
            //find user that refferred the user that reffered the current user about to register
            const { res: secondGen } = yield query.find({ ref_code: ref });
            const { res: reff } = yield refQuery.find({ ref_code: secondGen.ref });
            //check if the user that reffered the current user was refferred
            if (secondGen && (reff.second_gen === "" || reff.second_gen === ' ')) {
                //update the refferral tables/document to add user as the second_gen to who refferred the one that reffered the user 
                yield refQuery.updateOne({ ref_code: secondGen.ref }, { second_gen: username });
            }
            response.status = "success";
            response.error = "";
            response.user = user;
            req.session.user = user;
        }
        catch (error) {
            console.log(error);
            response.status = "500";
            response.error = "an internal server occurred";
        }
        res.json(response);
    });
}
exports.addUserWithRefCode = addUserWithRefCode;
