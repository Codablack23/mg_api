"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutes = void 0;
const admin_1 = __importDefault(require("../admin"));
const bots_1 = __importDefault(require("../bots"));
const payments_1 = __importDefault(require("../payments"));
const users_1 = __importDefault(require("../users"));
function getRoutes() {
    return {
        bots: bots_1.default,
        users: users_1.default,
        admin: admin_1.default,
        payments: payments_1.default
    };
}
exports.getRoutes = getRoutes;
