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
exports.UserController = void 0;
const Jwt = require("jsonwebtoken");
const env_1 = require("../environments/env");
const Bid_1 = require("../models/Bid");
const User_1 = require("../models/User");
const WalletTransaction_1 = require("../models/WalletTransaction");
const Utils_1 = require("../utils/Utils");
class UserController {
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = req.query.password;
            const user = req.user;
            try {
                yield Utils_1.Utils.comparePassword({
                    plainPassword: password,
                    encryptedPassword: user.password
                });
                const token = Jwt.sign({ code: user.code, user_id: user._id }, (0, env_1.getEnvironmentVariables)().jwt_secret, { expiresIn: '120d' });
                const data = { message: "Success", token: token, data: user };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static passwordChange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.user.user_id;
            const password = req.body.password;
            const old_password = req.body.old_password;
            const hash = yield Utils_1.Utils.encryptPassword(password);
            var update = Object.assign({ password: hash }, { updated_at: new Utils_1.Utils().indianTimeZone });
            try {
                yield Utils_1.Utils.comparePassword({
                    plainPassword: old_password,
                    encryptedPassword: req.user_data.password
                });
                const user = yield User_1.default.findOneAndUpdate({ _id: user_id }, update, { new: true, useFindAndModify: false });
                res.json({
                    message: 'Password change Successfully',
                    data: user,
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static passwordForgot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = req.body.code;
            const password = req.body.password;
            const hash = yield Utils_1.Utils.encryptPassword(password);
            var update = Object.assign({ password: hash }, { updated_at: new Utils_1.Utils().indianTimeZone });
            try {
                const user = yield User_1.default.findOneAndUpdate({ code: code }, update, { new: true, useFindAndModify: false });
                res.json({
                    message: 'Password update Successfully',
                    data: user,
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static userData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var userId = req.user.user_id;
            try {
                var users = yield User_1.default.findById({ _id: userId }, { __v: 0 });
                let bids = yield Bid_1.default.find({ user_id: userId }); // , ticket_type:"tickets"
                var sum = 0;
                for (const bid of bids) {
                    sum += bid['bid_amount'];
                }
                // var bidagg = await Bid.aggregate([
                //     { $match: { user_id:req.user.user_id } },
                //     { $group: { _id: null, total_bid: { $sum: "$bid_amount" } } },
                // ]);
                // console.log(bids);
                const data = {
                    message: 'Success',
                    data: users,
                    exposure: sum,
                    // bidagg:bidagg
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static transaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield WalletTransaction_1.default.find({ $or: [{ from_id: req.user.user_id }, { to_id: req.user.user_id }] }).sort({ created_at: -1 }).populate([
                    { path: 'from_id' },
                    { path: 'to_id' },
                    { path: 'bid_id' }
                ]);
                const data = {
                    message: 'Success! All Transactions',
                    data: user
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allBid(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var user;
            try {
                if (req.query.limit) {
                    var limit = Number(req.query.limit);
                    user = yield Bid_1.default.find({ user_id: req.user.user_id, ticket_type: "tickets" }).sort({ created_at: -1 }).limit(limit).populate([
                        { path: 'ticket_id', populate: { path: "party_id", select: ['name'] } }
                    ]);
                }
                else {
                    user = yield Bid_1.default.find({ user_id: req.user.user_id, ticket_type: "tickets" }).sort({ created_at: -1 }).populate([
                        { path: 'ticket_id', populate: { path: "party_id", select: ['name'] } }
                    ]);
                }
                const data = {
                    message: 'Success! All Bids',
                    data: user
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static profile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.user_id;
            let passwordObject = {};
            if (req.body.password) {
                const password = yield Utils_1.Utils.encryptPassword(req.body.password);
                passwordObject.password = password;
            }
            try {
                var update = Object.assign(Object.assign(Object.assign({}, req.body), passwordObject), { updated_at: new Utils_1.Utils().indianTimeZone });
                const user = yield User_1.default.findOneAndUpdate({ _id: userId }, update, { new: true, useFindAndModify: false });
                res.json({
                    message: 'user update Successfully',
                    data: user,
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user._id;
            try {
                const user = yield User_1.default.findOneAndUpdate({ _id: userId }, req.body, { new: true, useFindAndModify: false });
                res.send(user);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            try {
                yield user.remove();
                res.json({
                    message: 'Success ! User Deleted Successfully',
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static bid(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var user_data = yield User_1.default.findOne({ _id: req.user.user_id });
                const bdata = {
                    user_id: req.user.user_id,
                    ticket_id: req.body.ticket_id,
                    ticket_type: req.body.ticket_type,
                    ticket_data: req.body.ticket_data,
                    yes_or_no: req.body.yes_or_no,
                    seat: req.body.seat,
                    winning_percentage: req.body.winning_percentage,
                    bid_amount: req.body.bid_amount,
                    bid_status: "pending",
                    created_at: new Utils_1.Utils().indianTimeZone,
                    updated_at: new Utils_1.Utils().indianTimeZone
                };
                let bid = yield new Bid_1.default(bdata).save();
                if (bid) {
                    const from_balance = user_data.wallet - req.body.bid_amount;
                    const idata = {
                        from: 'users',
                        from_id: req.user.user_id,
                        from_balance: from_balance,
                        mode: "bidding",
                        coins: req.body.bid_amount,
                        bid_id: bid['_id'],
                        created_at: new Utils_1.Utils().indianTimeZone,
                        updated_at: new Utils_1.Utils().indianTimeZone
                    };
                    let walletTransaction = yield new WalletTransaction_1.default(idata).save();
                    if (walletTransaction) {
                        var user_wallet = yield User_1.default.findOneAndUpdate({ _id: req.user.user_id }, { $inc: { wallet: -req.body.bid_amount } }, { new: true, useFindAndModify: false });
                    }
                    const data = {
                        message: 'Successfully bid on party ticket!',
                        bid: bid,
                        transaction: walletTransaction,
                        user: user_wallet,
                        status_code: 200
                    };
                    res.json(data);
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    static bid_candidate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var user_data = yield User_1.default.findOne({ _id: req.user.user_id });
                const bdata = {
                    user_id: req.user.user_id,
                    ticket_id: req.body.ticket_id,
                    ticket_type: req.body.ticket_type,
                    ticket_data: req.body.ticket_data,
                    yes_or_no: req.body.yes_or_no,
                    winning_percentage: req.body.winning_percentage,
                    bid_amount: req.body.bid_amount,
                    bid_status: "pending",
                    created_at: new Utils_1.Utils().indianTimeZone,
                    updated_at: new Utils_1.Utils().indianTimeZone
                };
                let bid = yield new Bid_1.default(bdata).save();
                if (bid) {
                    const from_balance = user_data.wallet - req.body.bid_amount;
                    const idata = {
                        from: 'users',
                        from_id: req.user.user_id,
                        from_balance: from_balance,
                        mode: "bidding",
                        coins: req.body.bid_amount,
                        bid_id: bid['_id'],
                        created_at: new Utils_1.Utils().indianTimeZone,
                        updated_at: new Utils_1.Utils().indianTimeZone
                    };
                    let walletTransaction = yield new WalletTransaction_1.default(idata).save();
                    if (walletTransaction) {
                        var user_wallet = yield User_1.default.findOneAndUpdate({ _id: req.user.user_id }, { $inc: { wallet: -req.body.bid_amount } }, { new: true, useFindAndModify: false });
                    }
                    const data = {
                        message: 'Successfully bid on candidate!',
                        bid: bid,
                        transaction: walletTransaction,
                        user: user_wallet,
                        status_code: 200
                    };
                    res.json(data);
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.UserController = UserController;
