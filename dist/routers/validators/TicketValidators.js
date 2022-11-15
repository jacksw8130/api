"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketValidators = void 0;
const express_validator_1 = require("express-validator");
const Party_1 = require("../../models/Party");
const Ticket_1 = require("../../models/Ticket");
class TicketValidators {
    static create() {
        return [
            (0, express_validator_1.body)('name', 'name Is Required'),
            (0, express_validator_1.body)('party_id', 'party_id Is Required').custom((party_id, { req }) => {
                return Party_1.default.findOne({ _id: party_id }).then(party => {
                    if (party) {
                        return true;
                    }
                    else {
                        throw new Error("Party Doesn't Exist");
                    }
                });
            }),
            (0, express_validator_1.body)('yes_winning_percent', 'yes_winning_percent Is Required'),
            (0, express_validator_1.body)('yes_seats', 'yes_seats Is Required'),
            (0, express_validator_1.body)('no_winning_percent', 'no_winning_percent Is Required'),
            (0, express_validator_1.body)('no_seats', 'no_seats Is Required'),
            (0, express_validator_1.body)('min_bid', 'min_bid Is Required'),
            (0, express_validator_1.body)('max_bid', 'max_bid Is Required')
        ];
    }
    static Ticket() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Ticket_1.default.findOne({ _id: id }, { __v: 0 }).populate([
                    { path: "party_id" },
                    { path: "bid_count" },
                    { path: "bids" }
                ]).then((ticket) => {
                    if (ticket) {
                        req.ticket = ticket;
                        return true;
                    }
                    else {
                        throw new Error('Ticket Does Not Exist');
                    }
                });
            })];
    }
    static partyTicket() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Ticket_1.default.find({ party_id: id }, { __v: 0 }).populate([{ path: "party_id" }, { path: "bids" }]).then((ticket) => {
                    if (ticket) {
                        req.ticket = ticket;
                        return true;
                    }
                    else {
                        throw new Error('Ticket Does Not Exist');
                    }
                });
            })];
    }
    static update() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Ticket_1.default.findOne({ _id: id }, { __v: 0 }).then((ticket) => {
                    if (ticket) {
                        req.ticket = ticket;
                        return true;
                    }
                    else {
                        throw new Error('Ticket Does Not Exist');
                    }
                });
            })];
    }
    static delete() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Ticket_1.default.findOne({ _id: id }, { __v: 0 }).then((ticket) => {
                    if (ticket) {
                        req.ticket = ticket;
                        return true;
                    }
                    else {
                        throw new Error('Ticket Does Not Exist');
                    }
                });
            })];
    }
}
exports.TicketValidators = TicketValidators;
