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
exports.PartyController = void 0;
const Bid_1 = require("../models/Bid");
const Party_1 = require("../models/Party");
const Ticket_1 = require("../models/Ticket");
const User_1 = require("../models/User");
const WalletTransaction_1 = require("../models/WalletTransaction");
const Utils_1 = require("../utils/Utils");
class PartyController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let party = yield new Party_1.default(req.body).save();
                res.json({
                    message: 'Party Save Successfully',
                    data: party,
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
            const PartyId = req.party._id;
            try {
                const party = yield Party_1.default.findOneAndUpdate({ _id: PartyId }, req.body, { new: true, useFindAndModify: false });
                res.json({
                    message: 'Party Updated Successfully',
                    data: party,
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
            const partyId = req.party._id;
            try {
                // update party winning_seats
                const party = yield Party_1.default.findOneAndUpdate({ _id: partyId }, { winning_seats: req.body.winning_seats, result_declare_status: true }, { new: true, useFindAndModify: false });
                if (party) {
                    let party_winning_seats = party['winning_seats'];
                    if (party_winning_seats) {
                        // All ticket of this party
                        let tickets = yield Ticket_1.default.find({ party_id: party['_id'] }, { __v: 0 });
                        for (const ticket of tickets) {
                            yield Ticket_1.default.findOneAndUpdate({ _id: ticket['_id'] }, { result_declare_status: true, expire: true }, { new: true, useFindAndModify: false });
                            const bids = yield Bid_1.default.find({ ticket_type: "tickets", ticket_id: ticket['_id'], result_declare_status: false, bid_status: "pending" });
                            for (const bid of bids) {
                                var user_data = yield User_1.default.findOne({ _id: bid['user_id'] });
                                // update yes_seats
                                if (bid['yes_or_no'] == "yes") {
                                    if (party_winning_seats >= bid['seat']) {
                                        let winning_amount = bid['bid_amount'] + (bid['bid_amount'] * bid['winning_percentage']) / 100;
                                        let to_balance = user_data.wallet + winning_amount;
                                        // update bid
                                        yield Bid_1.default.findOneAndUpdate({ _id: bid['_id'] }, { result: true, result_declare_status: true, winning_amount: winning_amount, bid_status: "win" }, { new: true, useFindAndModify: false });
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
                                            yield User_1.default.findOneAndUpdate({ _id: bid['user_id'] }, { $inc: { wallet: winning_amount } }, { new: true, useFindAndModify: false });
                                        }
                                    }
                                    else {
                                        yield Bid_1.default.findOneAndUpdate({ _id: bid['_id'] }, { result: false, result_declare_status: true, winning_amount: 0, bid_status: "loss" }, { new: true, useFindAndModify: false });
                                    }
                                }
                                else {
                                    if (party_winning_seats <= bid['seat']) {
                                        let winning_amount = bid['bid_amount'] + (bid['bid_amount'] * bid['winning_percentage']) / 100;
                                        let to_balance = user_data.wallet + winning_amount;
                                        // update bid
                                        yield Bid_1.default.findOneAndUpdate({ _id: bid['_id'] }, { result: true, result_declare_status: true, winning_amount: winning_amount, bid_status: "win" }, { new: true, useFindAndModify: false });
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
                                            yield User_1.default.findOneAndUpdate({ _id: bid['user_id'] }, { $inc: { wallet: winning_amount } }, { new: true, useFindAndModify: false });
                                        }
                                    }
                                    else {
                                        yield Bid_1.default.findOneAndUpdate({ _id: bid['_id'] }, { result: true, result_declare_status: true, winning_amount: 0, bid_status: "loss" }, { new: true, useFindAndModify: false });
                                    }
                                }
                            }
                        }
                    }
                }
                res.json({
                    message: 'Party Result Declared Successfully',
                    data: party,
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static Party(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const party = req.party;
            const data = {
                message: 'Success',
                data: party
            };
            res.json(data);
        });
    }
    static stateParty(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const party = req.party;
            const data = {
                message: 'Success',
                data: party
            };
            res.json(data);
        });
    }
    static allParty(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const party = yield Party_1.default.find({ status: true }, { __v: 0 }).populate({ path: "state_id" });
                const data = {
                    message: 'Success',
                    data: party
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allOwnerParty(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const party = yield Party_1.default.find();
                const data = {
                    message: 'Success',
                    data: party
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
            const party = req.party;
            try {
                yield party.remove();
                res.json({
                    message: 'Success ! Party Deleted Successfully',
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.PartyController = PartyController;
