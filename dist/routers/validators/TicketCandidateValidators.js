"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketCandidateValidators = void 0;
const express_validator_1 = require("express-validator");
const State_1 = require("../../models/State");
const Candidate_1 = require("../../models/Candidate");
const TicketCandidate_1 = require("../../models/TicketCandidate");
const Location_1 = require("../../models/Location");
class TicketCandidateValidators {
    static create() {
        return [
            (0, express_validator_1.body)('state_id', 'state_id Is Required').custom((state_id, { req }) => {
                return State_1.default.findOne({ _id: state_id }).then(state => {
                    if (state) {
                        return true;
                    }
                    else {
                        throw new Error("State Doesn't Exist");
                    }
                });
            }),
            (0, express_validator_1.body)('location_id', 'location_id Is Required').custom((location_id, { req }) => {
                return Location_1.default.findOne({ _id: location_id }).then(location => {
                    if (location) {
                        return true;
                    }
                    else {
                        throw new Error("location Doesn't Exist");
                    }
                });
            }),
            (0, express_validator_1.body)('candidate_id', 'candidate_id Is Required').custom((candidate_id, { req }) => {
                return Candidate_1.default.findOne({ _id: candidate_id }).then(candidate => {
                    if (candidate) {
                        return true;
                    }
                    else {
                        throw new Error("candidate Doesn't Exist");
                    }
                });
            }),
            (0, express_validator_1.body)('yes_winning_percent', 'yes_winning_percent Is Required').custom((yes_winning_percent, { req }) => {
                return TicketCandidate_1.default.findOne({ candidate_id: req.body.candidate_id }).then(ticketCandidate => {
                    if (ticketCandidate) {
                        throw new Error("Ticket for this candidate already exist");
                    }
                    else {
                        return true;
                    }
                });
            }),
            (0, express_validator_1.body)('no_winning_percent', 'no_winning_percent Is Required'),
            (0, express_validator_1.body)('min_bid', 'min_bid Is Required'),
            (0, express_validator_1.body)('max_bid', 'max_bid Is Required')
        ];
    }
    static TicketCandidate() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return TicketCandidate_1.default.findOne({ _id: id }, { __v: 0 }).populate([
                    { path: "state_id" },
                    { path: "candidate_id" },
                    { path: "location_id" },
                    { path: "bid_count" },
                    { path: "bids" }
                ]).then((ticketCandidate) => {
                    if (ticketCandidate) {
                        req.ticketCandidate = ticketCandidate;
                        return true;
                    }
                    else {
                        throw new Error('TicketCandidate Does Not Exist');
                    }
                });
            })];
    }
    static stateTicketCandidate() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return TicketCandidate_1.default.find({ candidate_id: id }, { __v: 0 }).populate([{ path: "state_id" }, { path: "candidate_id" }, { path: "location_id" }, { path: "bids" }]).then((ticketCandidate) => {
                    if (ticketCandidate) {
                        req.ticketCandidate = ticketCandidate;
                        return true;
                    }
                    else {
                        throw new Error('TicketCandidate Does Not Exist');
                    }
                });
            })];
    }
    static stateTicket() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return State_1.default.findOne({ _id: id }, { __v: 0 }).then((state) => {
                    if (state) {
                        req.state = state;
                        return true;
                    }
                    else {
                        throw new Error('State Does Not Exist');
                    }
                });
            })];
    }
    static locationTicket() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Location_1.default.findOne({ _id: id }, { __v: 0 }).then((location) => {
                    if (location) {
                        req.location = location;
                        return true;
                    }
                    else {
                        throw new Error('Location Does Not Exist');
                    }
                });
            })];
    }
    static update() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return TicketCandidate_1.default.findOne({ _id: id }, { __v: 0 }).then((ticketCandidate) => {
                    if (ticketCandidate) {
                        req.ticketCandidate = ticketCandidate;
                        return true;
                    }
                    else {
                        throw new Error('TicketCandidate Does Not Exist');
                    }
                });
            })];
    }
    static delete() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return TicketCandidate_1.default.findOne({ _id: id }, { __v: 0 }).then((ticketCandidate) => {
                    if (ticketCandidate) {
                        req.ticketCandidate = ticketCandidate;
                        return true;
                    }
                    else {
                        throw new Error('TicketCandidate Does Not Exist');
                    }
                });
            })];
    }
}
exports.TicketCandidateValidators = TicketCandidateValidators;
