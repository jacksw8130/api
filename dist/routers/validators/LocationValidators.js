"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationValidators = void 0;
const express_validator_1 = require("express-validator");
const Candidate_1 = require("../../models/Candidate");
const Location_1 = require("../../models/Location");
const State_1 = require("../../models/State");
class LocationValidators {
    static create() {
        return [
            (0, express_validator_1.body)('state_id', 'state_id Is Required').custom((state_id, { req }) => {
                return State_1.default.findOne({ _id: state_id }).then(state => {
                    if (state) {
                        return true;
                    }
                    else {
                        throw new Error('state not Exist');
                    }
                });
            }),
            (0, express_validator_1.body)('name', 'name Is Required').custom((name, { req }) => {
                return Location_1.default.findOne({ name: name, state_id: req.body.state_id }).then(location => {
                    if (location) {
                        throw new Error('Location Already Exist');
                    }
                    else {
                        return true;
                    }
                });
            }),
        ];
    }
    static Location() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Location_1.default.findOne({ _id: id }, { __v: 0 }).populate({ path: "state_id" }).then((location) => {
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
    static stateLocation() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Location_1.default.find({ state_id: id }, { __v: 0 }).populate([{ path: "state_id" }, { path: "candidate_winner_id" }]).then((location) => {
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
    static result() {
        return [
            (0, express_validator_1.body)('candidate_winner_id', 'candidate_winner_id Is Required').custom((candidate_winner_id, { req }) => {
                return Candidate_1.default.findOne({ _id: candidate_winner_id }, { __v: 0 }).then((candidate) => {
                    if (candidate) {
                        req.candidate = candidate;
                        return true;
                    }
                    else {
                        throw new Error('Candidate Does Not Exist');
                    }
                });
            }),
            (0, express_validator_1.param)('id').custom((id, { req }) => {
                return Location_1.default.findOne({ _id: id }, { __v: 0 }).then((location) => {
                    if (location) {
                        req.location = location;
                        return true;
                    }
                    else {
                        throw new Error('Location Does Not Exist');
                    }
                });
            })
        ];
    }
    static delete() {
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
}
exports.LocationValidators = LocationValidators;
