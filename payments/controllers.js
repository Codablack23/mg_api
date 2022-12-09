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
exports.makeWithdrawal = exports.getWithdrawals = void 0;
const uuid_1 = require("uuid");
const payments_1 = require("../config/models/mongo_db/payments");
const Queries_1 = require("../config/services/Queries");
const withdraw_1 = require("../config/services/withdraw");
function getWithdrawals(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.MongoQuery(payments_1.Withdrawal);
        const username = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.username;
        const result = {
            status: "pending",
            error: ""
        };
        try {
            const { res: withdrawals } = yield query.findAll({ username });
            result.status = "success";
            result.withdrawals = withdrawals;
        }
        catch (error) {
            result.status = "Server Error";
            result.error = "An error occured in the server please try again later";
            throw error;
        }
        res.json(result);
    });
}
exports.getWithdrawals = getWithdrawals;
function makeWithdrawal(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.MongoQuery(payments_1.Withdrawal);
        const { amount } = req.body;
        const username = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.username;
        const result = {
            status: "pending",
            error: ""
        };
        const transfer_details = (0, withdraw_1.generateWithdrawDetails)(Object.assign(Object.assign({}, req.body), { email: "codablack24@gmail.com" }));
        if (parseFloat(amount) >= 10) {
            if (transfer_details.generated) {
                const balance = yield (0, withdraw_1.getBalance)(username);
                if (amount <= balance) {
                    try {
                        const withdrawal_id = (0, uuid_1.v4)();
                        yield query.createRecord({
                            username,
                            status: "unpaid",
                            withdrawal_id,
                            amount,
                        });
                        const transfer_res = yield (0, withdraw_1.transfer)(transfer_details === null || transfer_details === void 0 ? void 0 : transfer_details.details);
                        // console.log(transfer_res)
                        if (transfer_res.status === "success") {
                            yield query.updateOne({
                                withdrawal_id: withdrawal_id,
                            }, { status: "paid" });
                            result.status = "success";
                            result.message = `your withdrawal was successful and $${amount} sent to your bank account`,
                                result.details = Object.assign(Object.assign({}, transfer_details.details), { reference: transfer_res.data.reference });
                        }
                        else {
                            result.error = transfer_res.data.complete_message;
                            result.status = transfer_res.message;
                        }
                    }
                    catch (error) {
                        console.log(error);
                        result.status = "Server Error";
                        result.error = "An Error occured within our server please check your internet or try again";
                    }
                }
                else {
                    result.status = "Amount Error";
                    result.error = "Insufficient Balance";
                }
            }
            else {
                result.status = "Field Error";
                result.error = transfer_details.errors;
            }
        }
        else {
            result.status = "Amount Error";
            result.error = "withdrawal amount must start from $10";
        }
        res.json(result);
    });
}
exports.makeWithdrawal = makeWithdrawal;
