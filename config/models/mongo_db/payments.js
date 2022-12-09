"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDetails = exports.Withdrawal = exports.Payment = void 0;
const mongoose_1 = require("mongoose");
exports.Payment = (0, mongoose_1.model)("payments", new mongoose_1.Schema({
    username: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    payment_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true }), "payments");
exports.Withdrawal = (0, mongoose_1.model)("withdrawals", new mongoose_1.Schema({
    withdrawal_id: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        defaultValue: 0
    },
    username: {
        type: String,
        required: true
    }
}, { timestamps: true }), "withdrawals");
// account_name,
// account_type,
// account_number,
// bank,
// currency,
// firstname,
// lastname,
// email,
// country,
// routing_number,
// swift_code,
// address,
// street_name,
// street_no,
// postal_code,
// city,
exports.AccountDetails = (0, mongoose_1.model)("account_details", new mongoose_1.Schema({
    account_name: {
        type: String,
        required: true
    },
    account_number: {
        type: String,
        required: true
    },
    account_type: {
        type: String,
        required: true
    },
    swift_code: {
        type: String,
        required: true
    },
    routing_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    street_name: {
        type: String,
        required: true
    },
    street_no: {
        type: String,
        required: true
    },
    postal_code: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    bank_name: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
}, { timestamps: true }), "account_details");
