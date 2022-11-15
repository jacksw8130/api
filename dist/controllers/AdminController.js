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
exports.AdminController = void 0;
const Jwt = require("jsonwebtoken");
const env_1 = require("../environments/env");
const Admin_1 = require("../models/Admin");
const User_1 = require("../models/User");
const Utils_1 = require("../utils/Utils");
const WalletTransaction_1 = require("../models/WalletTransaction");
const Bid_1 = require("../models/Bid");
class AdminController {
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = req.query.password;
            const admin = req.admin;
            try {
                yield Utils_1.Utils.comparePassword({
                    plainPassword: password,
                    encryptedPassword: admin.password
                });
                const token = Jwt.sign({ code: admin.code, admin_id: admin._id }, (0, env_1.getEnvironmentVariables)().jwt_secret, { expiresIn: '120d' });
                const data = { message: "Success", token: token, data: admin };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminId = req.admin.admin_id;
            let passwordObject = {};
            if (req.body.password) {
                const password = yield Utils_1.Utils.encryptPassword(req.body.password);
                passwordObject.password = password;
            }
            var update = Object.assign(Object.assign(Object.assign({}, req.body), passwordObject), { updated_at: new Date() });
            //res.send(req.body);
            try {
                const admin = yield Admin_1.default.findOneAndUpdate({ _id: adminId }, update, { new: true, useFindAndModify: false });
                res.json({
                    message: 'admin update Successfully',
                    data: admin,
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static data(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var adminId = req.admin.admin_id;
            try {
                var admin = yield Admin_1.default.findById({ _id: adminId }, { __v: 0 });
                var userCount = yield User_1.default.countDocuments({ admin_id: adminId });
                let myData = admin.toObject();
                myData['total_user'] = userCount;
                // total deposit
                const depositTransactions = yield WalletTransaction_1.default.find({ to_id: admin['_id'], mode: "transfer" });
                var dt = 0;
                for (const depositTransaction of depositTransactions) {
                    dt += depositTransaction['coins'];
                }
                myData['total_deposit'] = dt;
                // total transfer
                const transferTransactions = yield WalletTransaction_1.default.find({ from_id: admin['_id'], mode: "transfer" });
                var tt = 0;
                for (const transferTransaction of transferTransactions) {
                    tt += transferTransaction['coins'];
                }
                myData['total_transfer'] = tt;
                const data = {
                    message: 'Success',
                    admin: myData,
                    userCount: userCount
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.find({ admin_id: req.admin.admin_id });
                const data = {
                    message: 'Success !',
                    data: user
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static sAllUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.default.find({ admin_id: req.admin.admin_id }).populate({ path: 'admin_id' });
                var users_array = [];
                for (const user of users) {
                    let myData = user.toObject();
                    // Balance
                    myData['balance'] = myData['wallet'];
                    // Exposure
                    let bids = yield Bid_1.default.find({ user_id: user['_id'], result_declare_status: false });
                    var sum = 0;
                    for (const bid of bids) {
                        sum += bid['bid_amount'];
                    }
                    myData['exposure'] = sum;
                    // Profit/Loss
                    let bids_complete = yield Bid_1.default.find({ user_id: user['_id'], result_declare_status: true });
                    var pl = 0;
                    for (const bidc of bids_complete) {
                        let remain = bidc['winning_amount'] - bidc['bid_amount'];
                        pl += remain;
                    }
                    myData['pl'] = pl;
                    users_array.push(myData);
                }
                const data = {
                    message: 'Success !',
                    data: users_array
                };
                res.status(200).json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = req.body.name;
            const code = req.body.code;
            const password = req.body.password;
            const hash = yield Utils_1.Utils.encryptPassword(password);
            // Generate Unique userCode Via user Counts
            // const user_count=await User.countDocuments()+1;
            // const user_code=Number(user_count+'00000000000').toString(36);
            // const code="u"+user_code;
            try {
                const insert = {
                    admin_id: req.admin.admin_id,
                    code: code,
                    password: hash,
                    name: name,
                    created_at: new Utils_1.Utils().indianTimeZone,
                    updated_at: new Utils_1.Utils().indianTimeZone
                };
                let user = yield new User_1.default(insert).save();
                const data = {
                    message: 'Success',
                    data: user
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static checkUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = req.body.code;
            const data = {
                message: 'User Code Available',
                code: code
            };
            res.json(data);
        });
    }
    static updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user._id;
            let passwordObject = {};
            if (req.body.password) {
                const password = yield Utils_1.Utils.encryptPassword(req.body.password);
                passwordObject.password = password;
            }
            var update = Object.assign(Object.assign(Object.assign({}, req.body), passwordObject), { updated_at: new Utils_1.Utils().indianTimeZone });
            try {
                const user = yield User_1.default.findOneAndUpdate({ _id: userId, admin_id: req.admin.admin_id }, update, { new: true, useFindAndModify: false });
                const data = {
                    message: 'Success',
                    data: user
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static transfer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const from = 'admins';
            const from_id = req.admin.admin_id;
            const to = 'users';
            const to_id = req.body.user_id;
            const mode = "transfer";
            const coins = req.body.coins;
            try {
                var user_data = yield User_1.default.findOne({ _id: req.body.user_id });
                var admin_data = yield Admin_1.default.findOne({ _id: req.admin.admin_id });
                const from_balance = Number(admin_data.wallet) - Number(coins);
                const to_balance = Number(user_data.wallet) + Number(coins);
                const idata = {
                    from: from,
                    from_id: from_id,
                    from_balance: from_balance,
                    to: to,
                    to_id: to_id,
                    to_balance: to_balance,
                    mode: mode,
                    coins: coins,
                    created_at: new Utils_1.Utils().indianTimeZone,
                    updated_at: new Utils_1.Utils().indianTimeZone
                };
                let walletTransaction = yield new WalletTransaction_1.default(idata).save();
                if (walletTransaction) {
                    var user_wallet = yield User_1.default.findOneAndUpdate({ _id: to_id }, { $inc: { wallet: coins, balance: coins } }, { new: true, useFindAndModify: false });
                    var admin_wallet = yield Admin_1.default.findOneAndUpdate({ _id: from_id }, { $inc: { wallet: -coins } }, { new: true, useFindAndModify: false });
                }
                const data = {
                    message: 'Success',
                    transaction: walletTransaction,
                    admin: admin_wallet,
                    user: user_wallet,
                    status_code: 200
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static withdraw(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const to = 'admins';
            const to_id = req.admin.admin_id;
            const from = 'users';
            const from_id = req.body.user_id;
            const mode = "withdraw";
            const coins = req.body.coins;
            try {
                var user_data = yield User_1.default.findOne({ _id: req.body.user_id });
                var admin_data = yield Admin_1.default.findOne({ _id: req.admin.admin_id });
                const from_balance = Number(user_data.wallet) - Number(coins);
                const to_balance = Number(admin_data.wallet) + Number(coins);
                const idata = {
                    from: from,
                    from_id: from_id,
                    from_balance: from_balance,
                    to: to,
                    to_id: to_id,
                    to_balance: to_balance,
                    mode: mode,
                    coins: coins,
                    created_at: new Utils_1.Utils().indianTimeZone,
                    updated_at: new Utils_1.Utils().indianTimeZone
                };
                let walletTransaction = yield new WalletTransaction_1.default(idata).save();
                if (walletTransaction) {
                    var user_wallet = yield User_1.default.findOneAndUpdate({ _id: from_id }, { $inc: { wallet: -coins } }, { new: true, useFindAndModify: false });
                    var admin_wallet = yield Admin_1.default.findOneAndUpdate({ _id: to_id }, { $inc: { wallet: coins } }, { new: true, useFindAndModify: false });
                }
                const data = {
                    message: 'Success',
                    transaction: walletTransaction,
                    user: user_wallet,
                    admin: admin_wallet,
                    status_code: 200
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield WalletTransaction_1.default.find({ $or: [{ from_id: req.admin.admin_id }, { to_id: req.admin.admin_id }] }).sort({ created_at: -1 }).populate([
                    { path: 'from_id' },
                    { path: 'to_id' },
                    { path: 'bid_id' }
                ]);
                const data = {
                    message: 'Success! All Transactions',
                    data: admin
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static userTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTransaction = yield WalletTransaction_1.default.find({ $or: [{ from_id: req.user._id }, { to_id: req.user._id }] }).sort({ created_at: -1 }).populate([
                    { path: 'from_id' },
                    { path: 'to_id' },
                    { path: 'bid_id' },
                ]);
                const data = {
                    message: 'Success! User All Transactions',
                    data: userTransaction
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.AdminController = AdminController;
