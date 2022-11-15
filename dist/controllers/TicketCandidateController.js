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
exports.TicketCandidateController = void 0;
const TicketCandidate_1 = require("../models/TicketCandidate");
const Bid_1 = require("../models/Bid");
const State_1 = require("../models/State");
const Candidate_1 = require("../models/Candidate");
const Location_1 = require("../models/Location");
class TicketCandidateController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (Number(req.body.max_bid) > Number(req.body.min_bid)) {
                    let ticketCandidate = yield new TicketCandidate_1.default(req.body).save();
                    res.status(200).json({
                        message: 'TicketCandidate Save Successfully',
                        data: ticketCandidate,
                        status_code: 200
                    });
                }
                else {
                    res.status(400).json({
                        message: 'max bid should be more than min bid',
                        status_code: 400
                    });
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const TicketCandidateId = req.ticketCandidate._id;
            try {
                const ticketCandidate = yield TicketCandidate_1.default.findOneAndUpdate({ _id: TicketCandidateId }, req.body, { new: true, useFindAndModify: false });
                res.json({
                    message: 'TicketCandidate Update Successfully',
                    data: ticketCandidate,
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static ticketCandidate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketCandidate = req.ticketCandidate;
            var sum = 0;
            if (ticketCandidate['bids']) {
                for (let bid of ticketCandidate['bids']) {
                    sum += bid['bid_amount'];
                }
            }
            const data = {
                message: 'Success',
                data: ticketCandidate,
                bid_sum: sum
            };
            res.json(data);
        });
    }
    static stateTicket(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const state = yield State_1.default.findOne({ _id: req.state._id }, { __v: 0 });
                let myData = state.toObject();
                myData['tickets'] = [];
                const candidates = yield Candidate_1.default.find({ state_id: myData['_id'], status: true }, { __v: 0 });
                for (const candidate of candidates) {
                    let tickets = yield TicketCandidate_1.default.find({ candidate_id: candidate['_id'], status: true }, { __v: 0 }).sort({ created_at: -1 }).populate('candidate_id');
                    myData['tickets'] = [...myData['tickets'], ...tickets];
                }
                const data = {
                    message: 'Success',
                    data: myData
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static locationTicket(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield Location_1.default.findOne({ _id: req.location._id }, { __v: 0 });
                let myData = location.toObject();
                myData['tickets'] = [];
                const candidates = yield Candidate_1.default.find({ location_id: myData['_id'], status: true }, { __v: 0 });
                for (const candidate of candidates) {
                    let tickets = yield TicketCandidate_1.default.find({ candidate_id: candidate['_id'], status: true }, { __v: 0 }).sort({ created_at: -1 }).populate('candidate_id');
                    myData['tickets'] = [...myData['tickets'], ...tickets];
                }
                const data = {
                    message: 'Success',
                    data: myData
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static ticketCandidateBids(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const bids = yield Bid_1.default.find({ ticket_id: req.ticketCandidate._id }, { __v: 0 }).populate({ path: "user_id" });
            const data = {
                message: 'Success',
                data: bids
            };
            res.json(data);
        });
    }
    static allTicketCandidate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticketCandidate = yield TicketCandidate_1.default.find({ status: true }, { __v: 0 }).populate({ path: "state_id" });
                const data = {
                    message: 'Success',
                    data: ticketCandidate
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allOwnerTicketCandidate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticketCandidate = yield TicketCandidate_1.default.find().populate({ path: "party_id" });
                const data = {
                    message: 'Success',
                    data: ticketCandidate
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
            const ticketCandidate = req.ticketCandidate;
            try {
                yield ticketCandidate.remove();
                res.json({
                    message: 'Success ! TicketCandidate Deleted Successfully',
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.TicketCandidateController = TicketCandidateController;
