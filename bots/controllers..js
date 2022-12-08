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
exports.deletePayment = exports.getRefs = exports.getPayments = exports.buyBot = exports.updatePayment = exports.paymentHandler = exports.invest = exports.getBots = exports.getInvestments = void 0;
const bots_1 = require("../config/models/mongo_db/bots");
const payments_1 = require("../config/models/mongo_db/payments");
const Queries_1 = require("../config/services/Queries");
const uuid_1 = require("uuid");
const user_1 = require("../config/models/sql/user");
function getInvestments(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.SQLQuery(bots_1.Investment);
        const { user } = req.session;
        const result = {
            status: "pending",
            err: "",
        };
        try {
            const { res: investments } = yield query.findAll({ username: user === null || user === void 0 ? void 0 : user.username });
            result.status = "success";
            result.investments = investments;
        }
        catch (error) {
            result.status = 'Network Error';
            result.err = "an error occured in the server try again later";
        }
        res.json(result);
    });
}
exports.getInvestments = getInvestments;
function getBots(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.SQLQuery(bots_1.Bot);
        const { user } = req.session;
        const result = {
            status: "pending",
            err: ""
        };
        try {
            const { res: bots } = yield query.findAll({ username: user === null || user === void 0 ? void 0 : user.username });
            result.status = "success",
                result.bots = bots;
        }
        catch (error) {
            result.status = "Server Error";
            result.error = "An error occured in our server check your network or try again later";
        }
        res.json(result);
    });
}
exports.getBots = getBots;
function invest(req, res) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function* () {
        const investmentQuery = new Queries_1.SQLQuery(bots_1.Investment);
        const refQuery = new Queries_1.SQLQuery(bots_1.Refferral);
        const userQuery = new Queries_1.SQLQuery(user_1.User);
        const botQuery = new Queries_1.SQLQuery(bots_1.Bot);
        const { amount, bot_id } = req.body;
        const date = new Date();
        const result = {
            status: "pending",
            error: ""
        };
        try {
            const { res: all_investment } = yield investmentQuery.findAll({ username: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.username });
            const { res: bot } = yield botQuery.find({
                username: (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.username,
                bot_id: bot_id
            });
            const { res: user } = yield userQuery.find({ username: (_c = req.session.user) === null || _c === void 0 ? void 0 : _c.username });
            let percent = parseFloat(bot.percentage_profit);
            let duration = parseInt(bot.duration);
            const expires = new Date(date.setDate(date.getDate() + duration));
            if (bot.used !== true) {
                yield bots_1.Investment.create({
                    username: (_d = req.session.user) === null || _d === void 0 ? void 0 : _d.username,
                    bot: bot.bot_name,
                    amount,
                    percentage_profit: bot.percentage_profit,
                    duration,
                    returns: (percent * duration) * amount,
                    expires: expires.toDateString()
                });
                if (user.reffered && (all_investment === null || all_investment === void 0 ? void 0 : all_investment.length) === 0) {
                    yield refQuery.updateOne({ first_gen: (_e = req.session.user) === null || _e === void 0 ? void 0 : _e.username }, { $inc: { amount: (parseFloat(amount) / duration) * 0.20 } });
                    yield refQuery.updateOne({ second_gen: (_f = req.session.user) === null || _f === void 0 ? void 0 : _f.username }, { $inc: { amount: (parseFloat(amount) / duration) * 0.03 } });
                }
                yield botQuery.updateOne({
                    username: (_g = req.session.user) === null || _g === void 0 ? void 0 : _g.username,
                    bot_id: bot_id
                }, { used: true });
                result.status = "Completed";
                result.investment = {
                    amount,
                    bot_id,
                    expires: expires.toDateString(),
                    percentage_profit: bot === null || bot === void 0 ? void 0 : bot.percentage_profit,
                };
            }
            else {
                result.status = 'Failed';
                result.error = "You cannot reuse a bot";
            }
        }
        catch (error) {
            console.log(error);
            result.status = 'Network Error';
            result.error = "an error occured in the server try again later";
        }
        res.json(result);
    });
}
exports.invest = invest;
function paymentHandler(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.SQLQuery(payments_1.Payment);
        const { description, amount } = req.body;
        const result = {
            status: "pending",
            error: ""
        };
        try {
            const payment_id = (0, uuid_1.v4)();
            yield query.createRecord({
                username: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.username,
                status: "unpaid",
                payment_id,
                description,
                amount,
            });
            result.status = "Payment initiated";
            result.payment_id = payment_id;
        }
        catch (error) {
            console.log(error);
            result.status = "Network error",
                result.status = "an internal error occured";
        }
        res.json(result);
    });
}
exports.paymentHandler = paymentHandler;
function updatePayment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.SQLQuery(payments_1.Payment);
        const result = {
            status: "pending",
            error: ""
        };
        const { id } = req.params;
        if (!(0, uuid_1.validate)(id)) {
            result.status = "Field Error";
            result.error = "please provide a valid uuid string";
        }
        else {
            try {
                const payment = yield query.updateOne({ payment_id: id }, { status: "paid" });
                if (payment) {
                    result.status = "Success";
                    result.error = "";
                    result.message = "Payment Completed Successfully";
                }
            }
            catch (error) {
                result.status = "Server Error",
                    result.error = "an error occured in our server please check your network or try again later";
            }
        }
        res.json(result);
    });
}
exports.updatePayment = updatePayment;
function buyBot(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.SQLQuery(bots_1.Bot);
        const { percent_profit, bot_name, bot_price } = req.body;
        let date = new Date();
        const duration = 90;
        const expires = new Date(date.setDate(date.getDate() + duration));
        const result = {
            status: "pending",
            error: ""
        };
        try {
            const bot_id = (0, uuid_1.v4)().slice(0, 4);
            yield query.createRecord({
                percentage_profit: percent_profit,
                bot_name,
                bot_price,
                active: true,
                username: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.username,
                bot_id,
                expires,
                duration
            });
            result.status = "success";
            result.message = "bot added sucessfully";
            result.bot = {
                bot_name,
                bot_id,
                expires,
                duration
            };
        }
        catch (error) {
            result.status = "Failed";
            result.error = "an internal error occurred please check your network or try again later";
        }
        res.json(result);
    });
}
exports.buyBot = buyBot;
function getPayments(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const result = {
            status: "pending",
            err: "",
        };
        try {
            const query = new Queries_1.SQLQuery(payments_1.Payment);
            const { res: payments } = yield query.findAll({ username: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.username });
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
function getRefs(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.SQLQuery(bots_1.Refferral);
        const result = {
            status: "pending",
            err: ""
        };
        try {
            const { res: referrals } = yield query.findAll({ ref_code: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.refcode });
            result.status = "completed";
            result.refs = referrals;
        }
        catch (error) {
            console.log(error);
            result.status = 'Network Error';
            result.err = "an error occured in the server try again later";
        }
        res.json(result);
    });
}
exports.getRefs = getRefs;
function deletePayment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.SQLQuery(payments_1.Payment);
        const response = {
            status: "pending",
            err: "pending"
        };
        const { id } = req.params;
        try {
            yield query.deleteRecord(id);
            response.status = "deleted";
            response.err = "";
            response.message = "payment deleted successfully";
        }
        catch (error) {
            response.status = 'Network Error';
            response.err = "an error occured in the server try again later";
        }
        res.json(response);
    });
}
exports.deletePayment = deletePayment;
