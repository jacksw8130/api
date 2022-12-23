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
exports.NoticeController = void 0;
const Notice_1 = require("../models/Notice");
class NoticeController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let notice = yield new Notice_1.default(req.body).save();
                res.json({
                    message: 'Notice Save Successfully',
                    data: notice,
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
            const NoticeId = req.notice._id;
            try {
                const notice = yield Notice_1.default.findOneAndUpdate({ _id: NoticeId }, req.body, { new: true, useFindAndModify: false });
                res.json({
                    message: 'Notice Updated Successfully',
                    data: notice,
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static Notice(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const notice = req.notice;
            const data = {
                message: 'Success',
                data: notice
            };
            res.json(data);
        });
    }
    static allNotice(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notice = yield Notice_1.default.find({ status: true }, { __v: 0 });
                const data = {
                    message: 'Success',
                    data: notice
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static allSuperAdminNotice(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notice = yield Notice_1.default.find();
                const data = {
                    message: 'Success',
                    data: notice
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
            const notice = req.notice;
            try {
                yield notice.remove();
                res.json({
                    message: 'Success ! Notice Deleted Successfully',
                    status_code: 200
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.NoticeController = NoticeController;
