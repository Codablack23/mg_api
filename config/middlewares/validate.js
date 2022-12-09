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
exports.validateInvest = exports.validateStartPayment = exports.validateBuyBot = exports.validateUpdateExchange = exports.checkExistingPassword = exports.validatePasswordChange = exports.validateRegister = exports.validateAdminLogin = exports.validateLogin = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_2 = require("express-validator");
const user_1 = require("../models/mongo_db/user");
const Queries_1 = require("../services/Queries");
function validateRequest(validations) {
    const validateLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(validations.map(validator => validator.run(req)));
        const errors = (0, express_validator_2.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        return res.json({
            status: "field-error",
            error: errors.array().map(err => ({
                field: err.param,
                error: err.msg
            }))
        });
    });
    return validateLogin;
}
exports.default = validateRequest;
exports.validateLogin = validateRequest([
    (0, express_validator_1.check)("phone").notEmpty().not().contains(" ").isLength({ min: 11, max: 15 }).isNumeric(),
    (0, express_validator_1.check)("password").notEmpty().not().contains(" ").isLength({ min: 8 })
]);
function validateAdminLogin() {
    return validateRequest([
        (0, express_validator_1.check)("username").notEmpty().withMessage("Please fill out this field")
            .not().contains(" ").withMessage("username should not contain whitespaces")
            .isLength({ min: 2 }).withMessage("username should atleast be 2 characters long"),
        (0, express_validator_1.check)("password").notEmpty().withMessage("Please fill out this field")
            .not().contains(" ").withMessage("Password should not contain whitespaces")
            .isLength({ min: 8 }).withMessage("Password should atleast be 8 characters long")
    ]);
}
exports.validateAdminLogin = validateAdminLogin;
function validateRegister() {
    const phoneCheck = (0, express_validator_1.check)("phone").notEmpty().withMessage("cannot be empty")
        .not().contains(" ").withMessage("should not contain spaces")
        .isLength({ min: 11, max: 15 }).withMessage("should be between 11 and 15 characters long")
        .isNumeric().withMessage("should contain only Numbers");
    const usernameCheck = (0, express_validator_1.check)('username')
        .notEmpty().withMessage("cannot be empty")
        .not().contains(" ").withMessage("should not contain spaces")
        .isAlphanumeric().withMessage("should not contain spaces")
        .isLength({ min: 2 }).withMessage("should not contain spaces");
    const nameCheck = (0, express_validator_1.check)("name")
        .notEmpty().withMessage("should not contain spaces")
        .isLength({ min: 3 }).withMessage("should atleast be 3 characters long");
    const passwordCheck = (0, express_validator_1.check)("password")
        .notEmpty().withMessage("should not be empty")
        .not().contains(" ").withMessage("should not contain spaces")
        .isLength({ min: 8 }).withMessage("should atleast be 8 characters long");
    const refcode = (0, express_validator_1.check)("refcode")
        .optional()
        .notEmpty().withMessage("should not be empty")
        .not().contains(" ").withMessage("should not contain spaces")
        .isLength({ min: 6, max: 6 }).withMessage("should be 6 characters long");
    console.log("validation");
    return validateRequest([
        phoneCheck,
        usernameCheck,
        nameCheck,
        passwordCheck,
        refcode
    ]);
}
exports.validateRegister = validateRegister;
function validatePasswordChange() {
    const passwordCheck = (0, express_validator_1.check)("password").notEmpty().not().contains(" ").isLength({ min: 8 });
    const newPasswordCheck = (0, express_validator_1.check)("new_password").notEmpty().not().contains(" ").isLength({ min: 8 });
    return validateRequest([
        passwordCheck,
        newPasswordCheck
    ]);
}
exports.validatePasswordChange = validatePasswordChange;
function checkExistingPassword(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const username = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.username;
        const { password } = req.body;
        const query = new Queries_1.MongoQuery(user_1.User);
        try {
            const { res } = yield query.find({ username });
            const doesPasswordMatch = yield bcrypt_1.default.compare(password, res.password);
            if (doesPasswordMatch) {
                return next();
            }
            res.json({
                status: "password error",
                error: "password provided does not match current password"
            });
        }
        catch (error) {
            return res.json({
                status: "server error",
                error: "an internal server error occurred please try again later"
            });
        }
    });
}
exports.checkExistingPassword = checkExistingPassword;
function validateUpdateExchange() {
    const rate = (0, express_validator_1.check)("rate").notEmpty().not().contains(" ").isNumeric();
    const type = (0, express_validator_1.check)("type").notEmpty().not().contains(" ");
    const conversion = (0, express_validator_1.check)("conversion").notEmpty().not().contains(" ");
    return validateRequest([
        rate,
        type,
        conversion
    ]);
}
exports.validateUpdateExchange = validateUpdateExchange;
function validateBuyBot() {
    const profit = (0, express_validator_1.check)('percent_profit').notEmpty().withMessage("Please fill out this field")
        .not().contains(" ").withMessage("Please remove any whitespaces from this field")
        .isNumeric().withMessage("This field should contain only numbers");
    const price = (0, express_validator_1.check)('bot_price').notEmpty().withMessage("Please fill out this field")
        .not().contains(" ").withMessage("Please remove any whitespaces from this field")
        .isNumeric().withMessage("This field should contain only numbers");
    const name = (0, express_validator_1.check)('bot_name').notEmpty().withMessage("Please fill out this field");
    return validateRequest([
        profit,
        price,
        name
    ]);
}
exports.validateBuyBot = validateBuyBot;
function validateStartPayment() {
    const desc = (0, express_validator_1.check)('description').notEmpty().withMessage("Please fill out this field");
    const amount = (0, express_validator_1.check)('amount').notEmpty().withMessage("Please fill out this field")
        .not().contains(" ").withMessage("Please remove any whitespaces from this field");
    return validateRequest([
        desc,
        amount
    ]);
}
exports.validateStartPayment = validateStartPayment;
function validateInvest() {
    const bot_id = (0, express_validator_1.check)('bot_id').notEmpty().withMessage("Please fill out this field")
        .isAlphanumeric().withMessage("This field should contain only numbers and alphabets");
    const amount = (0, express_validator_1.check)('amount').notEmpty().withMessage("Please fill out this field")
        .not().contains(" ").withMessage("Please remove any whitespaces from this field");
    return validateRequest([
        bot_id,
        amount
    ]);
}
exports.validateInvest = validateInvest;
