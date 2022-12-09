"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport = require('passport');
const mongoose = __importStar(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv = require("dotenv").config();
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = __importDefault(require("./admin"));
const bots_1 = __importDefault(require("./bots"));
const payments_1 = __importDefault(require("./payments"));
const users_1 = __importDefault(require("./users"));
const adminAuth_1 = require("./config/middlewares/adminAuth");
const Queries_1 = require("./config/services/Queries");
const admins_1 = require("./config/models/mongo_db/admins");
function addExchangeRate() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.MongoQuery(admins_1.Exchange);
        try {
            const { res: allExchange } = yield query.findAll();
            if (!allExchange) {
                const exchanges = [
                    { rate: 620, rate_type: "payment", conversion: "USD_NGN" },
                    { rate: 600, rate_type: "withdrawal", conversion: "USD_NGN" },
                    { rate: 0.8, rate_type: "payment", conversion: "USD_EUR" },
                    { rate: 0.95, rate_type: "payment", conversion: "USD_EUR" }
                ];
                exchanges.forEach(({ rate, rate_type, conversion }) => __awaiter(this, void 0, void 0, function* () {
                    yield query.createRecord({
                        rate,
                        rate_type,
                        conversion
                    });
                }));
                console.log("exchanges added");
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
const dbURI = process.env.MONGO_DB_URI2;
mongoose.connect(dbURI).then((err) => {
    console.log("connection established");
    addExchangeRate();
    (0, adminAuth_1.addSuperUser)().then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
}).catch(err => {
    console.log(err);
});
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const MONGO_SESSION_STORE = connect_mongo_1.default.create({
    mongoUrl: process.env.MONGO_DB_URI
});
//
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.use(express_1.default.urlencoded({ extended: true }));
//CORS config
app.use((0, cors_1.default)({
    credentials: true,
    origin: process.env.ENV == "dev" ? "http://localhost:3005" : process.env.FRONT_END
}));
const oneMonth = 1000 * 60 * 60 * 24 * 30;
//session config
app.use((0, express_session_1.default)({
    secret: (_a = process.env.SESSION_SECRET) !== null && _a !== void 0 ? _a : "",
    store: MONGO_SESSION_STORE,
    saveUninitialized: false,
    proxy: true,
    name: "api-magtech",
    resave: false,
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: oneMonth,
        sameSite: "none",
    }
}));
//passport auth 
// app.use(passport.initialize())
// app.use(passport.session())
//routers and handlers
app.use("/bots", bots_1.default);
app.use("/users", users_1.default);
app.use("/superusers", admin_1.default);
app.use('/withdrawals', payments_1.default);
app.get("/", (req, res) => {
    res.json({
        message: "the magtech api"
    });
});
//start server
app.listen(PORT || 5000, () => {
    console.log(`Running at PORT ${PORT || 5000}`);
});
