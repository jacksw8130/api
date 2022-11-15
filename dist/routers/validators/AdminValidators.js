"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidators = void 0;
const express_validator_1 = require("express-validator");
const Admin_1 = require("../../models/Admin");
const User_1 = require("../../models/User");
class AdminValidators {
    static createUser() {
        return [
            (0, express_validator_1.body)('name', 'name is Required').isString(),
            (0, express_validator_1.body)('code', 'code is Required').isString().custom((code, { req }) => {
                return User_1.default.findOne({ code: code }).then(user => {
                    if (user) {
                        throw new Error('User Already Exist');
                    }
                    else {
                        return true;
                    }
                });
            }),
            (0, express_validator_1.body)('password', 'password is Required').isString()
        ];
    }
    static checkUser() {
        return [
            (0, express_validator_1.body)('code', 'code is Required').isString().custom((code, { req }) => {
                return User_1.default.findOne({ code: code }).then(user => {
                    if (user) {
                        throw new Error('User code already exist');
                    }
                    else {
                        return true;
                    }
                });
            })
        ];
    }
    static userTransaction() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return User_1.default.findOne({ _id: id, admin_id: req.admin.admin_id }, { __v: 0 }).then((user) => {
                    if (user) {
                        req.user = user;
                        return true;
                    }
                    else {
                        throw new Error('user Does Not Exist');
                    }
                });
            })];
    }
    static login() {
        return [(0, express_validator_1.query)('code', 'Code is Required')
                .custom((code, { req }) => {
                return Admin_1.default.findOne({ code: code }).then(admin => {
                    if (admin) {
                        req.admin = admin;
                        return true;
                    }
                    else {
                        throw new Error('Admin Does Not Exist');
                    }
                });
            }), (0, express_validator_1.query)('password', 'Password is Required').isAlphanumeric()];
    }
    static updateUser() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return User_1.default.findOne({ _id: id }, { __v: 0 }).then((user) => {
                    if (user) {
                        req.user = user;
                        return true;
                    }
                    else {
                        throw new Error('user Does Not Exist');
                    }
                });
            })];
    }
    static transfer() {
        return [
            (0, express_validator_1.body)('coins', 'coins is Required').isNumeric().custom((coins, { req }) => {
                return Admin_1.default.findOne({ _id: req.admin.admin_id, wallet: { $gte: coins } }).then(admin => {
                    if (admin) {
                        return true;
                    }
                    else {
                        throw new Error('admin wallet not having enough balance');
                    }
                });
            }),
            (0, express_validator_1.body)('user_id', 'user_id Is Required').isString().custom((user_id, { req }) => {
                return User_1.default.findOne({ _id: user_id, admin_id: req.admin.admin_id }).then(user => {
                    if (user) {
                        return true;
                    }
                    else {
                        throw new Error('user not Exist');
                    }
                });
            })
        ];
    }
    static withdraw() {
        return [
            (0, express_validator_1.body)('user_id', 'user_id Is Required').isString().custom((user_id, { req }) => {
                return User_1.default.findOne({ _id: user_id, admin_id: req.admin.admin_id }).then(user => {
                    if (user) {
                        return true;
                    }
                    else {
                        throw new Error('user not Exist');
                    }
                });
            }),
            (0, express_validator_1.body)('coins', 'coins is Required').isNumeric().custom((coins, { req }) => {
                return User_1.default.findOne({ _id: req.body.user_id, wallet: { $gte: coins } }).then(user => {
                    if (user) {
                        return true;
                    }
                    else {
                        throw new Error('user wallet not having enough balance');
                    }
                });
            }),
        ];
    }
}
exports.AdminValidators = AdminValidators;
