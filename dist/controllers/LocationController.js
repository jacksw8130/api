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
exports.LocationController = void 0;
const Bid_1 = require("../models/Bid");
const Location_1 = require("../models/Location");
const TicketCandidate_1 = require("../models/TicketCandidate");
const User_1 = require("../models/User");
const WalletTransaction_1 = require("../models/WalletTransaction");
const Utils_1 = require("../utils/Utils");
class LocationController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let location = yield new Location_1.default(req.body).save();
                res.json({
                    message: 'Location Save Successfully',
                    data: location,
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
            const LocationId = req.location._id;
            try {
                const location = yield Location_1.default.findOneAndUpdate({ _id: LocationId }, req.body, { new: true, useFindAndModify: false });
                res.json({
                    message: 'Location Updated Successfully',
                    data: location,
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static result(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const locationId = req.location._id;
            try {
                // update location winning_seats
                const location = yield Location_1.default.findOneAndUpdate({ _id: locationId }, { candidate_winner_id: req.body.candidate_winner_id }, { new: true, useFindAndModify: false });
                if (location) {
                    let candidate_winner_id = location['candidate_winner_id'];
                    if (candidate_winner_id) {
                        // All ticket of this location
                        let tickets = yield TicketCandidate_1.default.find({ location_id: location['_id'] }, { __v: 0 });
                        for (const ticket of tickets) {
                            // update yes/no result
                            if (ticket['candidate_id'] == candidate_winner_id) {
                                yield TicketCandidate_1.default.findOneAndUpdate({ _id: ticket['_id'] }, { yes_result: true, no_result: false }, { new: true, useFindAndModify: false });
                            }
                            else {
                                yield TicketCandidate_1.default.findOneAndUpdate({ _id: ticket['_id'] }, { yes_result: false, no_result: true }, { new: true, useFindAndModify: false });
                            }
                            // Bid/Transaction Update
                            const bids = yield Bid_1.default.find({ ticket_type: "ticket_candidates", ticket_id: ticket._id, result_declare_status: false, bid_status: "pending" });
                            for (const bid of bids) {
                                var user_data = yield User_1.default.findOne({ _id: bid['user_id'] });
                                // update yes_seats
                                if (bid['yes_or_no'] == "yes") {
                                    if (ticket['yes_result'] == true) {
                                        let winning_amount = bid['bid_amount'] + (bid['bid_amount'] * bid['winning_percentage']) / 100;
                                        let to_balance = user_data.wallet + winning_amount;
                                        // update bid
                                        yield Bid_1.default.findOneAndUpdate({ _id: bid['_id'] }, { result_declare_status: true, winning_amount: winning_amount, bid_status: "win" }, { new: true, useFindAndModify: false });
                                        // create transaction
                                        const idata = {
                                            to: 'users',
                                            to_id: bid['user_id'],
                                            to_balance: to_balance,
                                            mode: "winning",
                                            coins: winning_amount,
                                            bid_id: bid['_id'],
                                            created_at: new Utils_1.Utils().indianTimeZone,
                                            updated_at: new Utils_1.Utils().indianTimeZone
                                        };
                                        let walletTransaction = yield new WalletTransaction_1.default(idata).save();
                                        if (walletTransaction) {
                                            var user_wallet = yield User_1.default.findOneAndUpdate({ _id: bid['user_id'] }, { $inc: { wallet: winning_amount } }, { new: true, useFindAndModify: false });
                                        }
                                    }
                                    else {
                                        yield Bid_1.default.findOneAndUpdate({ _id: bid['_id'] }, { result_declare_status: true, winning_amount: 0, bid_status: "loss" }, { new: true, useFindAndModify: false });
                                    }
                                }
                                else {
                                    if (ticket['no_result'] == true) {
                                        let winning_amount = bid['bid_amount'] + (bid['bid_amount'] * bid['winning_percentage']) / 100;
                                        let to_balance = user_data.wallet + winning_amount;
                                        // update bid
                                        yield Bid_1.default.findOneAndUpdate({ _id: bid['_id'] }, { result_declare_status: true, winning_amount: winning_amount, bid_status: "win" }, { new: true, useFindAndModify: false });
                                        // create transaction
                                        const idata = {
                                            to: 'users',
                                            to_id: bid['user_id'],
                                            to_balance: to_balance,
                                            mode: "winning",
                                            coins: winning_amount,
                                            bid_id: bid['_id'],
                                            created_at: new Utils_1.Utils().indianTimeZone,
                                            updated_at: new Utils_1.Utils().indianTimeZone
                                        };
                                        let walletTransaction = yield new WalletTransaction_1.default(idata).save();
                                        if (walletTransaction) {
                                            var user_wallet = yield User_1.default.findOneAndUpdate({ _id: bid['user_id'] }, { $inc: { wallet: winning_amount } }, { new: true, useFindAndModify: false });
                                        }
                                    }
                                    else {
                                        yield Bid_1.default.findOneAndUpdate({ _id: bid['_id'] }, { result_declare_status: true, winning_amount: 0, bid_status: "loss" }, { new: true, useFindAndModify: false });
                                    }
                                }
                            }
                        }
                    }
                }
                res.json({
                    message: 'Location Result Declared Successfully',
                    data: location,
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static Location(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = req.location;
            const data = {
                message: 'Success',
                data: location
            };
            res.json(data);
        });
    }
    static stateLocation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = req.location;
            const data = {
                message: 'Success',
                data: location
            };
            res.json(data);
        });
    }
    static allLocation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield Location_1.default.find({ status: true }, { __v: 0 }).populate({ path: "state_id" });
                const data = {
                    message: 'Success',
                    data: location
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allOwnerLocation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield Location_1.default.find();
                const data = {
                    message: 'Success',
                    data: location
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = req.location;
            try {
                yield location.remove();
                res.json({
                    message: 'Success ! Location Deleted Successfully',
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.LocationController = LocationController;
