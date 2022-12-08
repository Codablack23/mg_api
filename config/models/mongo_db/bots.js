"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Refferral = exports.Bot = exports.Investment = void 0;
const mongoose_1 = require("mongoose");
exports.Investment = (0, mongoose_1.model)("investment", new mongoose_1.Schema({
    username: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: false,
    },
    duration: {
        type: Number,
        required: false,
    },
    percentage_profit: {
        type: Number,
        required: false
    },
    returns: {
        type: Number,
        required: false,
    },
    expires: {
        type: Date,
        required: false,
    },
    bot: {
        type: String,
        required: false,
    }
}, { timestamps: true }));
exports.Bot = (0, mongoose_1.model)("bots", new mongoose_1.Schema({
    bot_price: {
        type: Number,
        required: true
    },
    bot_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    percentage_profit: {
        type: Number,
        required: true
    },
    expires: {
        type: Date,
        required: true,
    },
    bot_id: {
        type: String,
        required: true
    }
}, { timestamps: true }), "bots");
exports.Refferral = (0, mongoose_1.model)("refferals", new mongoose_1.Schema({
    ref_code: {
        type: String,
        required: true
    },
    first_gen: {
        type: String,
    },
    second_gen: {
        type: String,
    },
    amount: {
        type: Number,
        required: true
    },
}, { timestamps: true }), "refferrals");
