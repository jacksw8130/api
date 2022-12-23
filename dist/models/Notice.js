"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const Utils_1 = require("../utils/Utils");
const NoticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
    updated_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
}, { id: false });
NoticeSchema.set('toObject', { virtuals: true });
NoticeSchema.set('toJSON', { virtuals: true });
exports.default = (0, mongoose_1.model)('notices', NoticeSchema);
