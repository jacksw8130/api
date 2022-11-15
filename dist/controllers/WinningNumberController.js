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
const moment = require("moment-timezone");
class TicketController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    category: req.body.category,
                    ticket: req.body.ticket,
                    party_id: req.body.party_id,
                    result_date: req.body.result_date,
                    bidding_date: req.body.bidding_date,
                    result_date_indian: moment.tz(req.body.result_date, "Asia/Kolkata"),
                    owner_id: req.owner.owner_id
                };
                let ticket = yield new Ticket_1.default(data).save();
                res.json({
                    message: 'Ticket Save Successfully',
                    data: ticket,
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
            const TicketId = req.ticket._id;
            if (req.body.result_date) {
                req.body.result_date_indian = moment.tz(req.body.result_date, "Asia/Kolkata").add(5, 'hours').add(30, 'minute');
            }
            try {
                const ticket = yield Ticket_1.default.findOneAndUpdate({ _id: TicketId, owner_id: req.owner.owner_id }, req.body, { new: true, useFindAndModify: false });
                res.send(ticket);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static Ticket(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = req.ticket;
            const data = {
                message: 'Success',
                data: ticket
            };
            res.json(data);
        });
    }
    static allTicket(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield Ticket_1.default.find({ status: true, is_show: true }, { __v: 0 }).populate({ path: "party_id" }).sort({ result_date: -1 });
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
                const ticket = yield Ticket_1.default.find({ owner_id: req.owner.owner_id }).populate({ path: "party_id" }).sort({ result_date: -1 });
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
