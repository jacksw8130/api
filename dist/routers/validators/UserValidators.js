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
exports.UserValidators = void 0;
const express_validator_1 = require("express-validator");
const User_1 = require("../../models/User");
const Ticket_1 = require("../../models/Ticket");
const TicketCandidate_1 = require("../../models/TicketCandidate");
class UserValidators {
    static login() {
        return [(0, express_validator_1.query)('code', 'Code is Required')
                .custom((code, { req }) => {
                return User_1.default.findOne({ code: code, status: 1 }).then(user => {
                    if (user) {
                        req.user = user;
                        return true;
                    }
                    else {
                        throw new Error('User Does Not Exist');
                    }
                });
            }), (0, express_validator_1.query)('password', 'Password is Required').isString()];
    }
    static passwordForgot() {
        return [
            (0, express_validator_1.body)('password', 'Alphanumeric password is Required').isAlphanumeric(),
            (0, express_validator_1.body)('code', 'Code Is Required').custom((code, { req }) => {
                return User_1.default.findOne({ code: code }).then(user => {
                    if (user) {
                        return true;
                    }
                    else {
                        throw new Error('User Not Exist');
                    }
                });
            }),
        ];
    }
    static passwordChange() {
        return [
            (0, express_validator_1.body)('password', 'password is Required').isString(),
            (0, express_validator_1.body)('old_password', 'Old password is Required').isString().custom((old_password, { req }) => {
                return User_1.default.findOne({ _id: req.user.user_id }).then(user => {
                    if (user) {
                        req.user_data = user;
                        return true;
                    }
                    else {
                        throw new Error('User Not Exist');
                    }
                });
            }),
        ];
    }
    static deleteUser() {
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
    static update() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return User_1.default.findOne({ _id: id }, { __v: 0 }).then((user) => {
                    if (user) {
                        req.user = user;
                        return true;
                    }
                    else {
                        throw new Error('User Does Not Exist');
                    }
                });
            })];
    }
    static bid() {
        return [
            (0, express_validator_1.body)('bid_amount', 'bid_amount is Required').isNumeric().custom((bid_amount, { req }) => {
                return User_1.default.findOne({ _id: req.user.user_id, bid_status: true, wallet: { $gte: bid_amount } }).populate('admin_id').then(user => {
                    if (user) {
                        if (user['admin_id']['bid_status'] == true) {
                            return true;
                        }
                        else {
                            throw new Error('Contact Admin regarding bid ban');
                        }
                    }
                    else {
                        throw new Error('Low Balance / Bid Ban');
                    }
                });
            }),
            (0, express_validator_1.body)('yes_or_no', 'yes_or_no is Required'),
            (0, express_validator_1.body)('seat', 'seat is Required'),
            (0, express_validator_1.body)('winning_percentage', 'winning_percentage is Required'),
            (0, express_validator_1.body)('ticket_type', 'ticket_type is Required'),
            (0, express_validator_1.body)('ticket_id', 'ticket_id Is Required').custom((ticket_id, { req }) => {
                return Ticket_1.default.findOne({ _id: ticket_id, status: true, expire: false, result_declare_status: false }).populate({ path: "party_id", populate: { path: "state_id" } }).then((ticket) => __awaiter(this, void 0, void 0, function* () {
                    if (ticket) {
                        if (ticket['bid_status'] == true && ticket['party_id']['state_id']['bid_status'] == true) {
                            if (req.body.bid_amount >= ticket['min_bid'] && req.body.bid_amount <= ticket['max_bid']) {
                                return true;
                            }
                            else {
                                throw new Error("Bid Amount should be in between min_bid & max_bid");
                            }
                        }
                        else {
                            throw new Error("OOPs! Ticket Suspended");
                        }
                    }
                    else {
                        throw new Error('Ticket expire');
                    }
                }));
            }),
        ];
    }
    static bid_candidate() {
        return [
            (0, express_validator_1.body)('bid_amount', 'bid_amount is Required').isNumeric().custom((bid_amount, { req }) => {
                return User_1.default.findOne({ _id: req.user.user_id, bid_status: true, wallet: { $gte: bid_amount } }).populate('admin_id').then(user => {
                    if (user) {
                        if (user['admin_id']['bid_status'] == true) {
                            return true;
                        }
                        else {
                            throw new Error('Contact Admin regarding bid ban');
                        }
                    }
                    else {
                        throw new Error('Low Balance / Bid Ban');
                    }
                });
            }),
            (0, express_validator_1.body)('yes_or_no', 'yes_or_no is Required'),
            (0, express_validator_1.body)('winning_percentage', 'winning_percentage is Required'),
            (0, express_validator_1.body)('ticket_type', 'ticket_type is Required'),
            (0, express_validator_1.body)('ticket_id', 'ticket_id Is Required').custom((ticket_id, { req }) => {
                return TicketCandidate_1.default.findOne({ _id: ticket_id, status: true, expire: false, result_declare_status: false }).populate([{ path: "state_id" }, { path: "location_id" }, { path: "candidate_id" }]).then(ticketCandidate => {
                    if (ticketCandidate) {
                        if (ticketCandidate['candidate_id']['bid_status'] == true && ticketCandidate['location_id']['bid_status'] == true) {
                            if (req.body.bid_amount >= ticketCandidate['min_bid'] && req.body.bid_amount <= ticketCandidate['max_bid']) {
                                return true;
                            }
                            else {
                                throw new Error("Bid Amount should be in between min_bid & max_bid");
                            }
                        }
                        else {
                            throw new Error("OOPs! Ticket Suspended");
                        }
                    }
                    else {
                        throw new Error('Ticket expire');
                    }
                });
            }),
        ];
    }
}
exports.UserValidators = UserValidators;
