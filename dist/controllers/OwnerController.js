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
exports.OwnerController = void 0;
const Jwt = require("jsonwebtoken");
const env_1 = require("../environments/env");
const Owner_1 = require("../models/Owner");
const Superadmin_1 = require("../models/Superadmin");
const Admin_1 = require("../models/Admin");
const User_1 = require("../models/User");
const Utils_1 = require("../utils/Utils");
const WalletTransaction_1 = require("../models/WalletTransaction");
class OwnerController {
    static signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const phone = req.body.phone;
            const email = req.body.email;
            const name = req.body.name;
            const password = req.body.password;
            const hash = yield Utils_1.Utils.encryptPassword(password);
            try {
                const data = {
                    email: email,
                    password: hash,
                    name: name,
                    phone: phone,
                    created_at: new Utils_1.Utils().indianTimeZone,
                    updated_at: new Utils_1.Utils().indianTimeZone
                };
                let owner = yield new Owner_1.default(data).save();
                if (owner) {
                    const para = {
                        owner_id: owner._id,
                        email: email
                    };
                    const token = Jwt.sign(para, (0, env_1.getEnvironmentVariables)().jwt_secret, { expiresIn: '120d' });
                    const data = {
                        message: 'Success',
                        token: token,
                        data: owner
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
    static createSuperadmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const phone = req.body.phone;
            const email = req.body.email;
            const name = req.body.name;
            const password = req.body.password;
            const hash = yield Utils_1.Utils.encryptPassword(password);
            try {
                const insert = {
                    email: email,
                    password: hash,
                    name: name,
                    phone: phone,
                    created_at: new Utils_1.Utils().indianTimeZone,
                    updated_at: new Utils_1.Utils().indianTimeZone
                };
                let owner = yield new Superadmin_1.default(insert).save();
                const data = {
                    message: 'Super admin Created Successfully!',
                    data: owner
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = req.query.password;
            const owner = req.owner;
            try {
                yield Utils_1.Utils.comparePassword({
                    plainPassword: password,
                    encryptedPassword: owner.password
                });
                const token = Jwt.sign({ email: owner.email, owner_id: owner._id }, (0, env_1.getEnvironmentVariables)().jwt_secret, { expiresIn: '120d' });
                const data = { token: token, data: owner };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const ownerId = req.owner.owner_id;
            let passwordObject = {};
            if (req.body.password) {
                const password = yield Utils_1.Utils.encryptPassword(req.body.password);
                passwordObject.password = password;
            }
            var update = Object.assign(Object.assign({ name: req.body.name }, passwordObject), { updated_at: new Date() });
            //res.send(req.body);
            try {
                const owner = yield Owner_1.default.findOneAndUpdate({ _id: ownerId }, update, { new: true, useFindAndModify: false });
                res.json({
                    message: 'owner update Successfully',
                    data: owner,
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
            var ownerId = req.owner.owner_id;
            try {
                var owner = yield Owner_1.default.findById({ _id: ownerId }, { __v: 0 });
                var superAdminCount = yield Superadmin_1.default.countDocuments();
                var adminCount = yield Admin_1.default.countDocuments();
                var userCount = yield User_1.default.countDocuments();
                const data = {
                    message: 'Success',
                    owner: owner,
                    superAdminCount: superAdminCount,
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
    static all(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const owner = yield Owner_1.default.find({});
                const data = {
                    message: 'Success !',
                    Owner: owner
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allSuperadmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const superadmins = yield Superadmin_1.default.find({});
                const data = {
                    message: 'Success !',
                    data: superadmins
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allOwner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admins = yield Admin_1.default.find({ super_admin_id: req.superadmin._id });
                const data = {
                    message: 'Success !',
                    data: admins
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
                const admins = yield User_1.default.find({ admin_id: req.admin._id });
                const data = {
                    message: 'Success !',
                    data: admins
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static updateSuperadmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const superadminId = req.superadmin._id;
            try {
                const superadmin = yield Superadmin_1.default.findOneAndUpdate({ _id: superadminId }, req.body, { new: true, useFindAndModify: false });
                res.send(superadmin);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static transfer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const from = 'owners';
            const from_id = req.owner.owner_id;
            const to = 'super_admins';
            const to_id = req.body.superadmin_id;
            const mode = "transfer";
            const coins = req.body.coins;
            try {
                const idata = {
                    from: from,
                    from_id: from_id,
                    to: to,
                    to_id: to_id,
                    mode: mode,
                    coins: coins,
                    created_at: new Utils_1.Utils().indianTimeZone,
                    updated_at: new Utils_1.Utils().indianTimeZone
                };
                let walletTransaction = yield new WalletTransaction_1.default(idata).save();
                if (walletTransaction) {
                    var superadmin_wallet = yield Superadmin_1.default.findOneAndUpdate({ _id: to_id }, { $inc: { wallet: coins } }, { new: true, useFindAndModify: false });
                }
                const data = {
                    message: 'Transfer Success!',
                    transaction: walletTransaction,
                    superadmin: superadmin_wallet,
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
            const to = 'owners';
            const to_id = req.owner.owner_id;
            const from = 'super_admins';
            const from_id = req.body.superadmin_id;
            const mode = "withdraw";
            const coins = req.body.coins;
            try {
                const idata = {
                    from: from,
                    from_id: from_id,
                    to: to,
                    to_id: to_id,
                    mode: mode,
                    coins: coins,
                    created_at: new Utils_1.Utils().indianTimeZone,
                    updated_at: new Utils_1.Utils().indianTimeZone
                };
                let walletTransaction = yield new WalletTransaction_1.default(idata).save();
                if (walletTransaction) {
                    var superadmin_wallet = yield Superadmin_1.default.findOneAndUpdate({ _id: from_id }, { $inc: { wallet: -coins } }, { new: true, useFindAndModify: false });
                }
                const data = {
                    message: 'Withdraw Success!',
                    transaction: walletTransaction,
                    superadmin: superadmin_wallet,
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
                const owner = yield WalletTransaction_1.default.find().sort({ created_at: -1 }).populate([
                    { path: 'from_id' },
                    { path: 'to_id' }
                ]);
                const data = {
                    message: 'Success! All Transactions',
                    data: owner
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
                const owner = yield WalletTransaction_1.default.find({ $or: [{ from_id: req.owner.owner_id }, { to_id: req.owner.owner_id }] }).sort({ created_at: -1 }).populate([
                    { path: 'from_id' },
                    { path: 'to_id' }
                ]);
                const data = {
                    message: 'Success! All Transactions',
                    data: owner
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.OwnerController = OwnerController;
