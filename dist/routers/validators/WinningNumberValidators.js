"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketValidators = void 0;
const express_validator_1 = require("express-validator");
const Party_1 = require("../../models/Party");
const Ticket_1 = require("../../models/Ticket");
class TicketValidators {
    static create() {
        return [
            //body('category', 'category Is Required'),
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
            (0, express_validator_1.body)('ticket', 'ticket Is Required'),
            (0, express_validator_1.body)('result_date', 'result_date Is Required'),
            (0, express_validator_1.body)('bidding_date', 'bidding_date Is Required'),
        ];
    }
    static Ticket() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Ticket_1.default.findOne({ _id: id }, { __v: 0 }).populate({ path: "party_id" }).then((ticket) => {
                    if (ticket) {
                        req.ticket = ticket;
                        return true;
                    }
                    else {
                        throw new Error('winning Number Does Not Exist');
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
                        throw new Error('winning Number Does Not Exist');
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
                        throw new Error('winning Number Does Not Exist');
                    }
                });
            })];
    }
}
exports.TicketValidators = TicketValidators;
