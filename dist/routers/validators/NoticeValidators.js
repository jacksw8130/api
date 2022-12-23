"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeValidators = void 0;
const express_validator_1 = require("express-validator");
const Notice_1 = require("../../models/Notice");
class NoticeValidators {
    static create() {
        return [
            (0, express_validator_1.body)('title', 'title Is Required').custom((title, { req }) => {
                return Notice_1.default.findOne({ title: title }).then(notice => {
                    if (notice) {
                        throw new Error('Notice Already Exist');
                    }
                    else {
                        return true;
                    }
                });
            }),
            (0, express_validator_1.body)('message', 'message Is Required').isString()
        ];
    }
    static Notice() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Notice_1.default.findOne({ _id: id }, { __v: 0 }).then((notice) => {
                    if (notice) {
                        req.notice = notice;
                        return true;
                    }
                    else {
                        throw new Error('Notice Does Not Exist');
                    }
                });
            })];
    }
    static update() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Notice_1.default.findOne({ _id: id }, { __v: 0 }).then((notice) => {
                    if (notice) {
                        req.notice = notice;
                        return true;
                    }
                    else {
                        throw new Error('Notice Does Not Exist');
                    }
                });
            })];
    }
    static delete() {
        return [(0, express_validator_1.param)('id').custom((id, { req }) => {
                return Notice_1.default.findOne({ _id: id }, { __v: 0 }).then((notice) => {
                    if (notice) {
                        req.notice = notice;
                        return true;
                    }
                    else {
                        throw new Error('Notice Does Not Exist');
                    }
                });
            })];
    }
}
exports.NoticeValidators = NoticeValidators;
