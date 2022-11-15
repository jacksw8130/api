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
exports.TicketController = void 0;
const Ticket_1 = require("../models/Ticket");
const Bid_1 = require("../models/Bid");
class TicketController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.max_bid > req.body.min_bid) {
                    let ticket = yield new Ticket_1.default(req.body).save();
                    res.status(200).json({
                        message: 'Ticket Save Successfully',
                        data: ticket,
                        status_code: 200
                    });
                }
                else {
                    res.status(400).json({
                        message: 'max bid should be more than min bid',
                        status_code: 400
                    });
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const TicketId = req.ticket._id;
            try {
                const ticket = yield Ticket_1.default.findOneAndUpdate({ _id: TicketId }, req.body, { new: true, useFindAndModify: false });
                res.json({
                    message: 'Ticket Update Successfully',
                    data: ticket,
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static ticket(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = req.ticket;
            var sum = 0;
            if (ticket['bids']) {
                for (let bid of ticket['bids']) {
                    sum += bid['bid_amount'];
                }
            }
            const data = {
                message: 'Success',
                data: ticket,
                bid_sum: sum
            };
            res.json(data);
        });
    }
    static ticketBids(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const bids = yield Bid_1.default.find({ ticket_id: req.ticket._id, ticket_type: "tickets" }, { __v: 0 }).populate({ path: "user_id" });
            const data = {
                message: 'Success',
                data: bids
            };
            res.json(data);
        });
    }
    static allTicket(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield Ticket_1.default.find({ status: true }, { __v: 0 }).populate({ path: "party_id", populate: { path: "state_id" } });
                const data = {
                    message: 'Success',
                    data: ticket
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allOwnerTicket(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield Ticket_1.default.find().populate({ path: "party_id" });
                const data = {
                    message: 'Success',
                    data: ticket
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
            const ticket = req.ticket;
            try {
                yield ticket.remove();
                res.json({
                    message: 'Success ! Ticket Deleted Successfully',
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.TicketController = TicketController;
