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
exports.SuperadminController = void 0;
const Jwt = require("jsonwebtoken");
const env_1 = require("../environments/env");
const Superadmin_1 = require("../models/Superadmin");
const Admin_1 = require("../models/Admin");
const User_1 = require("../models/User");
const Utils_1 = require("../utils/Utils");
const WalletTransaction_1 = require("../models/WalletTransaction");
const Bid_1 = require("../models/Bid");
class SuperadminController {
    static signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = req.body.code;
            const name = req.body.name;
            const password = req.body.password;
            const hash = yield Utils_1.Utils.encryptPassword(password);
            try {
                const data = {
                    password: hash,
                    name: name,
                    code: code,
                    created_at: new Utils_1.Utils().indianTimeZone,
                    updated_at: new Utils_1.Utils().indianTimeZone
                };
                let superadmin = yield new Superadmin_1.default(data).save();
                if (superadmin) {
                    const para = {
                        superadmin_id: superadmin._id,
                        code: code
                    };
                    const token = Jwt.sign(para, (0, env_1.getEnvironmentVariables)().jwt_secret, { expiresIn: '120d' });
                    const data = {
                        message: 'Success',
                        token: token,
                        data: superadmin
                    };
                    res.json(data);
                }
                else {
                    throw new Error('Something Went Wrong');
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    static createAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = req.body.name;
            const code = req.body.code;
            const password = req.body.password;
            const hash = yield Utils_1.Utils.encryptPassword(password);
            // Generate Unique adminCode Via admin Counts
            // const admin_count=await Admin.countDocuments()+1;
            // const admin_code=Number(admin_count+'00000000000').toString(36);
            // const code="a"+admin_code;
            try {
                const insert = {
                    super_admin_id: req.superadmin.superadmin_id,
                    code: code,
                    password: hash,
                    name: name,
                    created_at: new Utils_1.Utils().indianTimeZone,
                    updated_at: new Utils_1.Utils().indianTimeZone
                };
                let admin = yield new Admin_1.default(insert).save();
                const data = {
                    message: 'Success',
                    data: admin
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static checkAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = req.body.code;
            const data = {
                message: 'Admin Code Available',
                code: code
            };
            res.json(data);
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = req.query.password;
            const superadmin = req.superadmin;
            try {
                yield Utils_1.Utils.comparePassword({
                    plainPassword: password,
                    encryptedPassword: superadmin.password
                });
                const token = Jwt.sign({ code: superadmin.code, superadmin_id: superadmin._id }, (0, env_1.getEnvironmentVariables)().jwt_secret, { expiresIn: '120d' });
                const data = { message: "Success", token: token, data: superadmin };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const superadminId = req.superadmin.superadmin_id;
            let passwordObject = {};
            if (req.body.password) {
                const password = yield Utils_1.Utils.encryptPassword(req.body.password);
                passwordObject.password = password;
            }
            var update = Object.assign(Object.assign(Object.assign({}, req.body), passwordObject), { updated_at: new Date() });
            //res.send(req.body);
            try {
                const superadmin = yield Superadmin_1.default.findOneAndUpdate({ _id: superadminId }, update, { new: true, useFindAndModify: false });
                res.json({
                    message: 'superadmin update Successfully',
                    data: superadmin,
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
            var superadminId = req.superadmin.superadmin_id;
            try {
                var superadmin = yield Superadmin_1.default.findById({ _id: superadminId }, { __v: 0 });
                var adminCount = yield Admin_1.default.countDocuments();
                var userCount = yield User_1.default.countDocuments();
                const data = {
                    message: 'Success',
                    superadmin: superadmin,
                    adminCount: adminCount,
                    userCount: userCount,
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admins = yield Admin_1.default.find({ super_admin_id: req.superadmin.superadmin_id }).populate({ path: 'user_count' });
                var admins_array = [];
                for (const admin of admins) {
                    let myData = admin.toObject();
                    // Balance
                    myData['balance'] = myData['wallet'];
                    // total deposit
                    const depositTransactions = yield WalletTransaction_1.default.find({ to_id: admin['_id'], mode: "transfer" });
                    var dt = 0;
                    for (const depositTransaction of depositTransactions) {
                        dt += depositTransaction['coins'];
                    }
                    myData['total_deposit'] = dt;
                    admins_array.push(myData);
                }
                const data = {
                    message: 'Success !',
                    data: admins_array
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
                const users = yield User_1.default.find({ admin_id: req.admin._id });
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
                    // total deposit
                    const depositTransactions = yield WalletTransaction_1.default.find({ to_id: user['_id'], mode: "transfer" });
                    var dt = 0;
                    for (const depositTransaction of depositTransactions) {
                        dt += depositTransaction['coins'];
                    }
                    myData['total_deposit'] = dt;
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
    static sAllUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.default.find().populate({ path: 'admin_id' });
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
                    // total deposit
                    const depositTransactions = yield WalletTransaction_1.default.find({ to_id: user['_id'], mode: "transfer" });
                    var dt = 0;
                    for (const depositTransaction of depositTransactions) {
                        dt += depositTransaction['coins'];
                    }
                    myData['total_deposit'] = dt;
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
    static updateAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminId = req.admin._id;
            let passwordObject = {};
            if (req.body.password) {
                const password = yield Utils_1.Utils.encryptPassword(req.body.password);
                passwordObject.password = password;
            }
            var update = Object.assign(Object.assign(Object.assign({}, req.body), passwordObject), { updated_at: new Utils_1.Utils().indianTimeZone });
            try {
                const admin = yield Admin_1.default.findOneAndUpdate({ _id: adminId, super_admin_id: req.superadmin.superadmin_id }, update, { new: true, useFindAndModify: false });
                const data = {
                    message: 'Success !',
                    data: admin
                };
                res.status(200).json(data);
            }
            catch (e) {
                next(e);
            }
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
                const user = yield User_1.default.findOneAndUpdate({ _id: userId }, update, { new: true, useFindAndModify: false });
                const data = {
                    message: 'Success !',
                    data: user
                };
                res.status(200).json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    // static async bidResult(req, res, next) {
    //     const ticket = req.ticket;
    //     try {
    //         const bids = await Bid.find({ticket_type:"tickets",ticket_id: ticket._id,result_declare_status:false,bid_status:"pending"});
    //         for (const bid of bids) {
    //             // update yes_seats
    //             if(bid['yes_or_no']=="yes"){
    //                 if(ticket['yes_result']==true){
    //                     let winning_amount = (bid['bid_amount']*ticket['yes_winning_percent'])/100;
    //                     // update bid
    //                     await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:winning_amount,bid_status:"win"}, {new: true, useFindAndModify: false});
    //                     // create transaction
    //                     const idata = {
    //                         to: 'users',
    //                         to_id: bid['user_id'],
    //                         mode: "winning",
    //                         coins: winning_amount,
    //                         bid_id: bid['_id'],
    //                         created_at: new Utils().indianTimeZone,
    //                         updated_at: new Utils().indianTimeZone
    //                     };
    //                     let walletTransaction = await new WalletTransaction(idata).save();
    //                     if(walletTransaction){
    //                         var user_wallet = await User.findOneAndUpdate({_id: bid['user_id']}, { $inc: { wallet: winning_amount} }, {new: true, useFindAndModify: false});
    //                     }
    //                 }else{
    //                     await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:0,bid_status:"loss"}, {new: true, useFindAndModify: false});
    //                 }
    //             }else{
    //                 if(ticket['no_result']==true){
    //                     let winning_amount = (bid['bid_amount']*ticket['no_winning_percent'])/100;
    //                     // update bid
    //                     await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:winning_amount,bid_status:"win"}, {new: true, useFindAndModify: false});
    //                     // create transaction
    //                     const idata = {
    //                         to: 'users',
    //                         to_id: bid['user_id'],
    //                         mode: "winning",
    //                         coins: winning_amount,
    //                         bid_id: bid['_id'],
    //                         created_at: new Utils().indianTimeZone,
    //                         updated_at: new Utils().indianTimeZone
    //                     };
    //                     let walletTransaction = await new WalletTransaction(idata).save();
    //                     if(walletTransaction){
    //                         var user_wallet = await User.findOneAndUpdate({_id: bid['user_id']}, { $inc: { wallet: winning_amount} }, {new: true, useFindAndModify: false});
    //                     }
    //                 }else{
    //                     await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:0,bid_status:"loss"}, {new: true, useFindAndModify: false});
    //                 }
    //             }   
    //         }
    //         const data = {
    //             message : 'Success! Result declared for every bid of this ticket',
    //             bids:bids
    //         };
    //         res.json(data);
    //     } catch (e) {
    //         next(e);
    //     }
    // }
    static transfer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const from = 'super_admins';
            const from_id = req.superadmin.superadmin_id;
            const to = 'admins';
            const to_id = req.body.admin_id;
            const mode = "transfer";
            const coins = req.body.coins;
            try {
                var admin_data = yield Admin_1.default.findOne({ _id: req.body.admin_id });
                const to_balance = Number(admin_data.wallet) + Number(coins);
                const idata = {
                    from: from,
                    from_id: from_id,
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
                    var admin_wallet = yield Admin_1.default.findOneAndUpdate({ _id: to_id }, { $inc: { wallet: coins } }, { new: true, useFindAndModify: false });
                }
                const data = {
                    message: 'Success',
                    transaction: walletTransaction,
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
    static withdraw(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const to = 'super_admins';
            const to_id = req.superadmin.superadmin_id;
            const from = 'admins';
            const from_id = req.body.admin_id;
            const mode = "withdraw";
            const coins = req.body.coins;
            try {
                var admin_data = yield Admin_1.default.findOne({ _id: req.body.admin_id });
                const from_balance = admin_data.wallet - coins;
                const idata = {
                    from: from,
                    from_id: from_id,
                    from_balance: from_balance,
                    to: to,
                    to_id: to_id,
                    mode: mode,
                    coins: coins,
                    created_at: new Utils_1.Utils().indianTimeZone,
                    updated_at: new Utils_1.Utils().indianTimeZone
                };
                let walletTransaction = yield new WalletTransaction_1.default(idata).save();
                if (walletTransaction) {
                    var admin_wallet = yield Admin_1.default.findOneAndUpdate({ _id: from_id }, { $inc: { wallet: -coins } }, { new: true, useFindAndModify: false });
                }
                const data = {
                    message: 'Success',
                    transaction: walletTransaction,
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
    static myTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const superadmin = yield WalletTransaction_1.default.find({ $or: [{ from_id: req.superadmin.superadmin_id }, { to_id: req.superadmin.superadmin_id }] }).sort({ created_at: -1 }).populate([
                    { path: 'from_id' },
                    { path: 'to_id' },
                    { path: 'bid_id' },
                ]);
                const data = {
                    message: 'Success! All Transactions',
                    data: superadmin
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
    static adminTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminTransaction = yield WalletTransaction_1.default.find({ $or: [{ from_id: req.admin._id }, { to_id: req.admin._id }] }).sort({ created_at: -1 }).populate([
                    { path: 'from_id' },
                    { path: 'to_id' },
                    { path: 'bid_id' },
                ]);
                const data = {
                    message: 'Success! Admin All Transactions',
                    data: adminTransaction
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
                var condition = {};
                if (req.body.user_code && !req.body.from_date && !req.body.to_date) {
                    condition = { $or: [{ from_id: req.body.user_code }, { to_id: req.body.user_code }] };
                }
                else if (!req.body.user_code && req.body.from_date && req.body.to_date) {
                    condition = {
                        created_on: {
                            $gte: new Date(req.body.from_date),
                            $lt: new Date(req.body.to_date)
                        }
                    };
                }
                else if (req.body.user_code && req.body.from_date && req.body.to_date) {
                    condition = {
                        $or: [{ from_id: req.body.user_code }, { to_id: req.body.user_code }],
                        created_on: {
                            $gte: new Date(req.body.from_date),
                            $lt: new Date(req.body.to_date),
                        }
                    };
                }
                const superadmin = yield WalletTransaction_1.default.find(condition).sort({ created_at: -1 }).populate([
                    { path: 'from_id' },
                    { path: 'to_id' },
                    { path: 'bid_id' }
                ]);
                const data = {
                    message: 'Success! All Transactions',
                    data: superadmin
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.SuperadminController = SuperadminController;
