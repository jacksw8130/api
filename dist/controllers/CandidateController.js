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
exports.CandidateController = void 0;
const Candidate_1 = require("../models/Candidate");
const Ticket_1 = require("../models/Ticket");
class CandidateController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let candidate = yield new Candidate_1.default(req.body).save();
                res.json({
                    message: 'Candidate Save Successfully',
                    data: candidate,
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
            const CandidateId = req.candidate._id;
            try {
                const candidate = yield Candidate_1.default.findOneAndUpdate({ _id: CandidateId }, req.body, { new: true, useFindAndModify: false });
                res.json({
                    message: 'Candidate Updated Successfully',
                    data: candidate,
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
            const candidateId = req.candidate._id;
            try {
                // update candidate winning_seats
                const candidate = yield Candidate_1.default.findOneAndUpdate({ _id: candidateId }, { winning_seats: req.body.winning_seats }, { new: true, useFindAndModify: false });
                if (candidate) {
                    let candidate_winning_seats = candidate['winning_seats'];
                    if (candidate_winning_seats) {
                        // All ticket of this candidate
                        let tickets = yield Ticket_1.default.find({ candidate_id: candidate['_id'] }, { __v: 0 });
                        for (const ticket of tickets) {
                            // update yes_seats
                            if (candidate_winning_seats >= ticket['yes_seats']) {
                                yield Ticket_1.default.findOneAndUpdate({ _id: ticket['_id'] }, { yes_result: true }, { new: true, useFindAndModify: false });
                            }
                            else {
                                yield Ticket_1.default.findOneAndUpdate({ _id: ticket['_id'] }, { yes_result: false }, { new: true, useFindAndModify: false });
                            }
                            // update no_seats
                            if (candidate_winning_seats <= ticket['no_seats']) {
                                yield Ticket_1.default.findOneAndUpdate({ _id: ticket['_id'] }, { no_result: true }, { new: true, useFindAndModify: false });
                            }
                            else {
                                yield Ticket_1.default.findOneAndUpdate({ _id: ticket['_id'] }, { no_result: false }, { new: true, useFindAndModify: false });
                            }
                        }
                    }
                }
                res.json({
                    message: 'Candidate Winning Seat Updated Successfully',
                    data: candidate,
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static Candidate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = req.candidate;
            const data = {
                message: 'Success',
                data: candidate
            };
            res.json(data);
        });
    }
    static stateCandidate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = req.candidate;
            const data = {
                message: 'Success',
                data: candidate
            };
            res.json(data);
        });
    }
    static locationCandidate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = req.candidate;
            const data = {
                message: 'Success',
                data: candidate
            };
            res.json(data);
        });
    }
    static allCandidate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield Candidate_1.default.find({ status: true }, { __v: 0 }).populate({ path: "state_id" });
                const data = {
                    message: 'Success',
                    data: candidate
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allOwnerCandidate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield Candidate_1.default.find();
                const data = {
                    message: 'Success',
                    data: candidate
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
            const candidate = req.candidate;
            try {
                yield candidate.remove();
                res.json({
                    message: 'Success ! Candidate Deleted Successfully',
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.CandidateController = CandidateController;
