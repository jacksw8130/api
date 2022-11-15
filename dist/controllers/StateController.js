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
exports.StateController = void 0;
const Party_1 = require("../models/Party");
const State_1 = require("../models/State");
const Ticket_1 = require("../models/Ticket");
class StateController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let state = yield new State_1.default(req.body).save();
                res.json({
                    message: 'State Save Successfully',
                    data: state,
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
            const StateId = req.state._id;
            try {
                const state = yield State_1.default.findOneAndUpdate({ _id: StateId }, req.body, { new: true, useFindAndModify: false });
                res.json({
                    message: 'State Updated Successfully',
                    data: state,
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static State(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = req.state;
            const data = {
                message: 'Success',
                data: state
            };
            res.json(data);
        });
    }
    static allState(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const state = yield State_1.default.find({ status: true }, { __v: 0 });
                const data = {
                    message: 'Success',
                    data: state
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allStateWithTicket(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const state = yield State_1.default.find({ status: true }, { __v: 0 });
                let state_array = [];
                for (let data of state) {
                    let myData = data.toObject();
                    myData['tickets'] = [];
                    const parties = yield Party_1.default.find({ state_id: myData['_id'], status: true }, { __v: 0 });
                    for (const party of parties) {
                        let tickets = yield Ticket_1.default.find({ party_id: party['_id'], status: true }, { __v: 0 }).sort({ created_at: -1 }).populate('party_id');
                        myData['tickets'] = [...myData['tickets'], ...tickets];
                    }
                    state_array.push(myData);
                }
                const data = {
                    message: 'Success',
                    data: state_array
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static userAllState(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const state = yield State_1.default.find({ status: true, bid_status: true }, { __v: 0 });
                const data = {
                    message: 'Success',
                    data: state
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static stateTickets(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var total_tickets = [];
                const parties = yield Party_1.default.find({ state_id: req.param.stateId, status: true }, { __v: 0 });
                for (const party of parties) {
                    let tickets = yield Ticket_1.default.find({ party_id: party['_id'], status: true }, { __v: 0 });
                    total_tickets.push(tickets);
                }
                const data = {
                    message: 'Success',
                    data: total_tickets
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allOwnerState(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const state = yield State_1.default.find();
                const data = {
                    message: 'Success',
                    data: state
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
            const state = req.state;
            try {
                yield state.remove();
                res.json({
                    message: 'Success ! State Deleted Successfully',
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.StateController = StateController;
