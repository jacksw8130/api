"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateValidators = void 0;
const express_validator_1 = require("express-validator");
const State_1 = require("../../models/State");
class StateValidators {
    static create() {
        return [
            (0, express_validator_1.body)('name', 'name Is Required').custom((name, { req }) => {
                return State_1.default.findOne({ name: name }).then(state => {
                    if (state) {
                        throw new Error('State Already Exist');
                    }
                    else {
                        return true;
                    }
                });
            })
        ];
    }
    static State() {
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
    static stateTickets() {
        return [(0, express_validator_1.param)('stateId').custom((stateId, { req }) => {
                return State_1.default.findOne({ _id: stateId, status: true, bid_status: true }, { __v: 0 }).then((state) => {
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
    static update() {
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
    static delete() {
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
}
exports.StateValidators = StateValidators;
