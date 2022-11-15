"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyValidators = void 0;
const express_validator_1 = require("express-validator");
const Party_1 = require("../../models/Party");
class PartyValidators {
    static create() {
        return [
            (0, express_validator_1.body)('state_id', 'state_id Is Required'),
            (0, express_validator_1.body)('name', 'name Is Required').custom((name, { req }) => {
                return Party_1.default.findOne({ name: name, state_id: req.body.state_id }).then(party => {
                    if (party) {
                        throw new Error('Party Already Exist');
                    }
                    else {
                        return true;
                    }
                });
            })
        ];
    }
    static Party() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Party_1.default.findOne({ _id: id }, { __v: 0 }).populate({ path: "state_id" }).then((party) => {
                    if (party) {
                        req.party = party;
                        return true;
                    }
                    else {
                        throw new Error('Party Does Not Exist');
                    }
                });
            })];
    }
    static stateParty() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Party_1.default.find({ state_id: id, status: true }, { __v: 0 }).populate([{ path: "state_id" }]).then((party) => {
                    if (party) {
                        req.party = party;
                        return true;
                    }
                    else {
                        throw new Error('Party Does Not Exist');
                    }
                });
            })];
    }
    static update() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Party_1.default.findOne({ _id: id }, { __v: 0 }).then((party) => {
                    if (party) {
                        req.party = party;
                        return true;
                    }
                    else {
                        throw new Error('Party Does Not Exist');
                    }
                });
            })];
    }
    static result() {
        return [
            (0, express_validator_1.body)('winning_seats', 'winning_seats Is Required').isNumeric(),
            (0, express_validator_1.param)('id').custom((id, { req }) => {
                return Party_1.default.findOne({ _id: id }, { __v: 0 }).then((party) => {
                    if (party) {
                        if (party['result_declare_status'] == false) {
                            req.party = party;
                            return true;
                        }
                        else {
                            throw new Error('Party Result Already Declared');
                        }
                    }
                    else {
                        throw new Error('Party Does Not Exist');
                    }
                });
            })
        ];
    }
    static delete() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Party_1.default.findOne({ _id: id }, { __v: 0 }).then((party) => {
                    if (party) {
                        req.party = party;
                        return true;
                    }
                    else {
                        throw new Error('Party Does Not Exist');
                    }
                });
            })];
    }
}
exports.PartyValidators = PartyValidators;
