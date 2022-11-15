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
exports.PartyController = void 0;
const Party_1 = require("../models/Party");
class PartyController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let party = yield new Party_1.default(req.body).save();
                res.json({
                    message: 'Party Save Successfully',
                    data: party,
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
            const PartyId = req.party._id;
            try {
                const party = yield Party_1.default.findOneAndUpdate({ _id: PartyId }, req.body, { new: true, useFindAndModify: false });
                res.send(party);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static Party(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const party = req.party;
            const data = {
                message: 'Success',
                data: party
            };
            res.json(data);
        });
    }
    static allParty(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const party = yield Party_1.default.find({ status: true }, { __v: 0 });
                const data = {
                    message: 'Success',
                    data: party
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allOwnerParty(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const party = yield Party_1.default.find();
                const data = {
                    message: 'Success',
                    data: party
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
            const party = req.party;
            try {
                yield party.remove();
                res.json({
                    message: 'Success ! Party Deleted Successfully',
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.PartyController = PartyController;
