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
exports.getBalance = exports.generateWithdrawDetails = exports.transfer = void 0;
const bots_1 = require("../models/mongo_db/bots");
const payments_1 = require("../models/mongo_db/payments");
const user_1 = require("../models/mongo_db/user");
const Queries_1 = require("./Queries");
const validate_1 = require("./validate");
const Flutterwave = require("flutterwave-node-v3");
const dotenv = require('dotenv').config();
const fw_keys = {
    public: process.env.FW_PUBLIC,
    private: process.env.FW_SECRET
};
function transfer(details) {
    return __awaiter(this, void 0, void 0, function* () {
        const flutterwave = new Flutterwave(fw_keys.public, fw_keys.private);
        console.log(details);
        return yield flutterwave.Transfer.initiate(details);
    });
}
exports.transfer = transfer;
const init = {
    account_name: "",
    account_type: "",
    account_number: "",
    bank: "",
    currency: "",
    firstname: "",
    lastname: "",
    email: "",
    country: "",
    routing_number: "",
    swift_code: "",
    address: "",
    street_name: "",
    street_no: "",
    postal_code: "",
    city: "",
    amount: ""
};
function generateWithdrawDetails(acc_details = Object.assign({}, init)) {
    const { account_name, account_type, account_number, bank, currency, firstname, lastname, email, country, routing_number, swift_code, address, street_name, street_no, postal_code, city, amount } = acc_details;
    console.log(account_type);
    const details = {
        debit_currency: "USD",
        narration: "withdrawal Payment",
        meta: {}
    };
    let errors = [];
    if (account_type) {
        switch (account_type) {
            case "NGN":
                errors = (0, validate_1.validateFields)([
                    { inputField: account_name, inputType: "text", inputName: "Account_Name" },
                    { inputField: account_number, inputType: "number", inputName: "Account_Number" },
                    { inputField: bank, inputType: "username", inputName: "Bank Name" },
                    { inputField: amount, inputType: "number", inputName: "Amount" },
                    { inputField: currency, inputType: "word", inputName: "Currency" },
                ]);
                details.account_name = account_name;
                details.account_bank = bank;
                details.account_number = account_number;
                details.amount = amount;
                details.currency = currency;
                return errors.length === 0
                    ? { details, generated: true }
                    : { errors, generated: false };
            case "NGN_USD":
                errors = (0, validate_1.validateFields)([
                    { inputField: account_name, inputType: "text", inputName: "Account_Name" },
                    { inputField: firstname, inputType: "word", inputName: "First_Name" },
                    { inputField: lastname, inputType: "word", inputName: "Last_Name" },
                    { inputField: account_number, inputType: "number", inputName: "Account_Number" },
                    { inputField: bank, inputType: "username", inputName: "Bank Name" },
                    { inputField: amount, inputType: "number", inputName: "Amount" },
                    { inputField: currency, inputType: "word", inputName: "Currency" },
                    { inputField: country, inputType: "word", inputName: "Country" },
                ]);
                details.account_bank = bank;
                details.account_number = account_number;
                details.amount = amount;
                details.currency = currency;
                details.meta = {
                    first_name: firstname,
                    last_name: lastname,
                    sender: "Magtech Inc",
                    merchant: "Magtech Inc",
                    email,
                    country,
                };
                return errors.length === 0
                    ? { details, generated: true }
                    : { errors, generated: false };
            case "USD":
                errors = (0, validate_1.validateFields)([
                    { inputField: account_name, inputType: "text", inputName: "Account_Name" },
                    { inputField: account_number, inputType: "username", inputName: "Account_Number" },
                    { inputField: bank, inputType: "text", inputName: "Bank_Name" },
                    { inputField: amount, inputType: "number", inputName: "Amount" },
                    { inputField: currency, inputType: "word", inputName: "Currency" },
                    { inputField: country, inputType: "word", inputName: "Country" },
                    { inputField: routing_number, inputType: "number", inputName: "Routing_Number" },
                    { inputField: swift_code, inputType: "username", inputName: "Swift_Code" },
                    { inputField: address, inputType: "address", inputName: "Address" },
                ]);
                details.amount = amount;
                details.currency = currency;
                details.beneficiary_name = account_name;
                details.meta = {
                    AccountNumber: account_number,
                    RoutingNumber: routing_number,
                    SwiftCode: swift_code,
                    BankName: bank,
                    BeneficiaryName: account_name,
                    BeneficiaryAddress: address,
                    BeneficiaryCountry: country
                };
                return errors.length === 0
                    ? { details, generated: true }
                    : { errors, generated: false };
            case "EUR":
                errors = (0, validate_1.validateFields)([
                    { inputField: account_name, inputType: "text", inputName: "Account_Name" },
                    { inputField: account_number, inputType: "username", inputName: "Account_Number" },
                    { inputField: bank, inputType: "text", inputName: "Bank_Name" },
                    { inputField: amount, inputType: "number", inputName: "Amount" },
                    { inputField: currency, inputType: "word", inputName: "Currency" },
                    { inputField: country, inputType: "word", inputName: "Country" },
                    { inputField: routing_number, inputType: "number", inputName: "Routing_Number" },
                    { inputField: swift_code, inputType: "username", inputName: "Swift_Code" },
                    { inputField: postal_code, inputType: "number", inputName: "Postal_Code" },
                    { inputField: street_name, inputType: "address", inputName: "Street_Name" },
                    { inputField: street_no, inputType: "number", inputName: "Street_Number" },
                    { inputField: city, inputType: "word", inputName: "City" },
                ]);
                details.amount = amount;
                details.currency = currency;
                details.beneficiary_name = account_name;
                details.meta = {
                    AccountNumber: account_number,
                    RoutingNumber: routing_number,
                    SwiftCode: swift_code,
                    BankName: bank,
                    BeneficiaryName: account_name,
                    PostalCode: postal_code,
                    StreetNumber: street_no,
                    StreetName: street_name,
                    City: city,
                    BeneficiaryCountry: country
                };
                return errors.length === 0
                    ? { details, generated: true }
                    : { errors, generated: false };
            default:
                errors = [{ message: "invalid account type only EUR, USD, NGN, NGN_USD types supported" }];
                return { errors, generated: false };
        }
    }
    else {
        errors = [{ message: "account type is required" }];
        return { errors, generated: false };
    }
}
exports.generateWithdrawDetails = generateWithdrawDetails;
function getBalance(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date();
        const withdrawQuery = new Queries_1.MongoQuery(payments_1.Withdrawal);
        const paymentQuery = new Queries_1.MongoQuery(payments_1.Payment);
        const botQuery = new Queries_1.MongoQuery(bots_1.Bot);
        const userQuery = new Queries_1.MongoQuery(user_1.User);
        const investmentQuery = new Queries_1.MongoQuery(bots_1.Investment);
        const refQuery = new Queries_1.MongoQuery(bots_1.Refferral);
        const { res: withdrawals } = yield withdrawQuery.findAll({ username });
        const { res: payments } = yield paymentQuery.findAll({ username });
        const { res: bots } = yield botQuery.findAll({ username });
        const { res: user } = yield userQuery.find({ username });
        const { res: refs } = yield refQuery.findAll({ ref_code: user.ref_code });
        const { res: investments } = yield investmentQuery.findAll({ username });
        const p_total = payments.filter((p) => p.status === "paid").reduce((total, p) => (total + p.amount), 0);
        const i_total = investments.filter((i) => {
            const expires = new Date(i.expires);
            const timeLeft = (expires - date) / (1000 * 60 * 60 * 24);
            return timeLeft > 0;
        }).reduce((a, b) => (a + b.amount), 0);
        const w_total = withdrawals.filter((p) => p.status === "paid").reduce((a, b) => (a + b.amount), 0);
        const ref_total = refs.reduce((a, b) => (a + b.amount), 0);
        const b_total = bots.reduce((a, b) => (a + b.bot_price), 0);
        const funds = p_total - i_total - w_total - ref_total - b_total;
        const iTotal = investments.reduce((a, b) => {
            const expires = new Date(b.expires);
            let timeLeft = (expires - date) / (1000 * 60 * 60 * 24);
            timeLeft = timeLeft < 0 ? 1 : timeLeft;
            return a + ((b.amount * b.percentage_profit) / timeLeft);
        }, 0);
        return funds + iTotal;
    });
}
exports.getBalance = getBalance;
