"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuth_1 = require("../config/middlewares/adminAuth");
const controllers_1 = require("./controllers");
const validate_1 = require("../config/middlewares/validate");
const adminApp = express_1.default.Router();
adminApp.post("/update-exchange", adminAuth_1.authenticateAdmin, (0, validate_1.validateUpdateExchange)(), controllers_1.updateExchange);
adminApp.post("/exchanges", controllers_1.getExchanges);
adminApp.post("/", adminAuth_1.authenticateAdmin, (req, res) => {
    res.json(Object.assign(Object.assign({}, req.session.admin), { status: "Authorized" }));
});
adminApp.post("/admin/withdrawals", controllers_1.getWithdrawals);
adminApp.post("/admin", (0, validate_1.validateAdminLogin)(), controllers_1.loginAdmin);
adminApp.post("/admin/investments", adminAuth_1.authenticateAdmin, controllers_1.getInvestments);
adminApp.post("/admin/all", adminAuth_1.authenticateAdmin, controllers_1.getAdmins);
adminApp.post("/admin/payments", adminAuth_1.authenticateAdmin, controllers_1.getPayments);
adminApp.post("/admin/users", adminAuth_1.authenticateAdmin, controllers_1.getUsers);
adminApp.post("/admin/add", controllers_1.addAdmin);
adminApp.get("/support/", (req, res) => {
    res.send("/");
});
exports.default = adminApp;
