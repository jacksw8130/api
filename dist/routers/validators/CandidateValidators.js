"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateValidators = void 0;
const express_validator_1 = require("express-validator");
const Candidate_1 = require("../../models/Candidate");
const Location_1 = require("../../models/Location");
const State_1 = require("../../models/State");
class CandidateValidators {
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
            (0, express_validator_1.body)('location_id', 'location_id Is Required').custom((location_id, { req }) => {
                return Location_1.default.findOne({ _id: location_id }).then(location => {
                    if (location) {
                        return true;
                    }
                    else {
                        throw new Error('location not Exist');
                    }
                });
            }),
            (0, express_validator_1.body)('name', 'name Is Required').custom((name, { req }) => {
                return Candidate_1.default.findOne({ name: name, location_id: req.body.location_id }).then(candidate => {
                    if (candidate) {
                        throw new Error('Candidate Already Exist');
                    }
                    else {
                        return true;
                    }
                });
            }),
            (0, express_validator_1.body)('party_name', 'party_name Is Required').custom((party_name, { req }) => {
                return Candidate_1.default.findOne({ party_name: party_name, location_id: req.body.location_id }).then(candidate => {
                    if (candidate) {
                        throw new Error('Party Already Exist');
                    }
                    else {
                        return true;
                    }
                });
            }),
        ];
    }
    static Candidate() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Candidate_1.default.findOne({ _id: id }, { __v: 0 }).populate({ path: "state_id" }).then((candidate) => {
                    if (candidate) {
                        req.candidate = candidate;
                        return true;
                    }
                    else {
                        throw new Error('Candidate Does Not Exist');
                    }
                });
            })];
    }
    static stateCandidate() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Candidate_1.default.find({ state_id: id }, { __v: 0 }).populate([{ path: "state_id" }]).then((candidate) => {
                    if (candidate) {
                        req.candidate = candidate;
                        return true;
                    }
                    else {
                        throw new Error('Candidate Does Not Exist');
                    }
                });
            })];
    }
    static locationCandidate() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Candidate_1.default.find({ location_id: id }, { __v: 0 }).populate([{ path: "location_id" }]).then((candidate) => {
                    if (candidate) {
                        req.candidate = candidate;
                        return true;
                    }
                    else {
                        throw new Error('Candidate Does Not Exist');
                    }
                });
            })];
    }
    static update() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Candidate_1.default.findOne({ _id: id }, { __v: 0 }).then((candidate) => {
                    if (candidate) {
                        req.candidate = candidate;
                        return true;
                    }
                    else {
                        throw new Error('Candidate Does Not Exist');
                    }
                });
            })];
    }
    static result() {
        return [
            (0, express_validator_1.body)('winning_seats', 'winning_seats Is Required'),
            (0, express_validator_1.param)('id').custom((id, { req }) => {
                return Candidate_1.default.findOne({ _id: id }, { __v: 0 }).then((candidate) => {
                    if (candidate) {
                        req.candidate = candidate;
                        return true;
                    }
                    else {
                        throw new Error('Candidate Does Not Exist');
                    }
                });
            })
        ];
    }
    static delete() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Candidate_1.default.findOne({ _id: id }, { __v: 0 }).then((candidate) => {
                    if (candidate) {
                        req.candidate = candidate;
                        return true;
                    }
                    else {
                        throw new Error('Candidate Does Not Exist');
                    }
                });
            })];
    }
}
exports.CandidateValidators = CandidateValidators;
