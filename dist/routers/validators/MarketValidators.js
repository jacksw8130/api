"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyValidators = void 0;
const express_validator_1 = require("express-validator");
const Party_1 = require("../../models/Party");
class PartyValidators {
    static create() {
        return [
            (0, express_validator_1.body)('name', 'name Is Required').custom((name, { req }) => {
                return Party_1.default.findOne({ name: name }).then(party => {
                    if (party) {
                        throw new Error('Party Already Exist');
                    }
                    else {
                        return true;
                    }
                });
            }),
            (0, express_validator_1.body)('seats', 'seats Is Required').isNumeric()
        ];
    }
    static Party() {
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
