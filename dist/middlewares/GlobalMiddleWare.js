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
exports.GlobalMiddleWare = void 0;
const express_validator_1 = require("express-validator");
const Jwt = require("jsonwebtoken");
const env_1 = require("../environments/env");
const User_1 = require("../models/User");
class GlobalMiddleWare {
    static checkError(req, res, next) {
        const error = (0, express_validator_1.validationResult)(req);
        const errorStatus = req.errorStatus || 400;
        if (!error.isEmpty()) {
            req.errorStatus = errorStatus;
            next(new Error(error.array()[0].msg));
        }
        else {
            next();
        }
    }
    // only for login
    static authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            try {
                Jwt.verify(token, (0, env_1.getEnvironmentVariables)().jwt_secret, ((err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        req.errorStatus = 401;
                        next(err);
                    }
                    else if (!decoded) {
                        req.errorStatus = 401;
                        next(new Error('User Not Authorised'));
                    }
                    else {
                        let cstatus = yield User_1.default.findOne({ _id: decoded.user_id }, { __v: 0 });
                        if (cstatus['status'] == true) {
                            req.user = decoded;
                            next();
                        }
                        else {
                            req.errorStatus = 401;
                            next(new Error('User Blocked'));
                        }
                    }
                })));
            }
            catch (e) {
                req.errorStatus = 401;
                next(e);
            }
        });
    }
    // for both - login or not
    static loginAuthenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            try {
                Jwt.verify(token, (0, env_1.getEnvironmentVariables)().jwt_secret, ((err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        next();
                    }
                    else if (!decoded) {
                        next();
                    }
                    else {
                        let cstatus = yield User_1.default.findOne({ _id: decoded.user_id }, { __v: 0 });
                        if (cstatus['status'] == true) {
                            req.user = decoded;
                            next();
                        }
                        else {
                            req.errorStatus = 401;
                            next(new Error('User Blocked'));
                        }
                    }
                })));
            }
            catch (e) {
                req.errorStatus = 401;
                next(e);
            }
        });
    }
    // for owner
    static ownerAuthenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            try {
                Jwt.verify(token, (0, env_1.getEnvironmentVariables)().jwt_secret, ((err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        req.errorStatus = 401;
                        next(err);
                    }
                    else if (!decoded.owner_id) {
                        req.errorStatus = 401;
                        next(new Error('Owner Not Authorised'));
                    }
                    else {
                        req.owner = decoded;
                        next();
                    }
                })));
            }
            catch (e) {
                req.errorStatus = 401;
                next(e);
            }
        });
    }
    // superadmin Authenticate
    static superadminAuthenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            try {
                Jwt.verify(token, (0, env_1.getEnvironmentVariables)().jwt_secret, ((err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        next(err);
                    }
                    else if (!decoded.superadmin_id) {
                        req.errorStatus = 401;
                        next(new Error('Superadmin Not Authorised'));
                    }
                    else {
                        req.superadmin = decoded;
                        next();
                    }
                })));
            }
            catch (e) {
                req.errorStatus = 401;
                next(e);
            }
        });
    }
    // admin Authenticate
    static adminAuthenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            try {
                Jwt.verify(token, (0, env_1.getEnvironmentVariables)().jwt_secret, ((err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        next(err);
                    }
                    else if (!decoded.admin_id) {
                        req.errorStatus = 401;
                        next(new Error('admin Not Authorised'));
                    }
                    else {
                        req.admin = decoded;
                        next();
                    }
                })));
            }
            catch (e) {
                req.errorStatus = 401;
                next(e);
            }
        });
    }
}
exports.GlobalMiddleWare = GlobalMiddleWare;
