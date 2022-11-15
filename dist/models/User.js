"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const Utils_1 = require("../utils/Utils");
const userSchema = new mongoose.Schema({
    admin_id: { type: mongoose.Types.ObjectId, ref: 'admins', required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: String, required: false },
    wallet: { type: Number, required: true, default: 0 },
    balance: { type: Number, required: true, default: 0 },
    bid_status: { type: Boolean, required: true, default: true },
    password_status: { type: Boolean, required: true, default: false },
    status: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
    updated_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
}, { id: false });
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
exports.default = (0, mongoose_1.model)('users', userSchema);
