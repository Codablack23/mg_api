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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport = require('passport');
const express_session_1 = __importDefault(require("express-session"));
const dotenv = require("dotenv").config();
const cors_1 = __importDefault(require("cors"));
const admin_1 = __importDefault(require("./admin"));
const bots_1 = __importDefault(require("./bots"));
const payments_1 = __importDefault(require("./payments"));
const users_1 = __importDefault(require("./users"));
const adminAuth_1 = require("./config/middlewares/adminAuth");
const Queries_1 = require("./config/services/Queries");
const admins_1 = require("./config/models/sql/admins");
const db_1 = require("./config/db");
const connect_session_sequelize_1 = __importDefault(require("connect-session-sequelize"));
const SequelizeStore = (0, connect_session_sequelize_1.default)(express_session_1.default.Store);
function addExchangeRate() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Queries_1.SQLQuery(admins_1.Exchange);
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
            return error;
        }
    });
}
db_1.sequelize.sync().then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("connected to magtech db");
    try {
        yield addExchangeRate();
        const data = yield (0, adminAuth_1.addSuperUser)();
        console.log(data);
    }
    catch (error) {
        console.log(error);
    }
})).catch(err => console.log(err));
//  const dbURI = process.env.MONGO_DB_URI2 as string
//   mongoose.connect(dbURI).then((err)=>{
//     console.log("connection established")
//     addExchangeRate()
//     addSuperUser().then(data=>{
//       console.log(data)
//     }).catch(err=>{
//       console.log(err)
//     })
//   }).catch(err=>{
//     console.log(err)
//   })
const app = (0, express_1.default)();
const PORT = process.env.PORT;
// const MONGO_SESSION_STORE = MongoStore.create({
//   mongoUrl:process.env.MONGO_DB_URI
// })
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
    store: new SequelizeStore({ db: db_1.sequelize }),
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
app.listen(5000, () => {
    console.log(`Running at PORT ${PORT || 5000}`);
});
