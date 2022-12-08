"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkRef_1 = require("../config/middlewares/checkRef");
const findUser_1 = require("../config/middlewares/findUser");
const userAuth_1 = require("../config/middlewares/userAuth");
const validate_1 = require("../config/middlewares/validate");
const controllers_1 = require("./controllers");
const userApp = express_1.default.Router();
//user routes and their handlers
userApp.get("/", (req, res) => res.send("auth"));
userApp.post("/forgot-password", controllers_1.forgotPassword);
userApp.post("/reset-password", controllers_1.resetPassword);
userApp.post("/change-password", userAuth_1.authenticate, controllers_1.sendResetPasswordToken);
userApp.post("/change-password/:id", userAuth_1.authenticate, controllers_1.changePassword);
userApp.post("/", userAuth_1.authenticate, (req, res) => {
    res.json({ user: Object.assign({}, req.session.user), status: "Authorized" });
});
userApp.post("/login", validate_1.validateLogin, (0, findUser_1.findUser)("login"), controllers_1.loginHandler);
userApp.post("/logout", userAuth_1.authenticate, controllers_1.logoutHandler);
userApp.post("/signup", (0, validate_1.validateRegister)(), (0, findUser_1.findUser)("signup"), checkRef_1.checkRef, checkRef_1.addUserWithRefCode, controllers_1.registerHandler);
userApp.get("/forgot-password/", (req, res) => { res.send("/"); });
exports.default = userApp;
