"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const Utils_1 = require("../utils/Utils");
const BidButtonSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: 'users', required: false },
    label: { type: String, required: true },
    value: { type: Number, required: true },
    status: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
    updated_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
}, { id: false });
BidButtonSchema.set('toObject', { virtuals: true });
BidButtonSchema.set('toJSON', { virtuals: true });
exports.default = (0, mongoose_1.model)('bid_buttons', BidButtonSchema);
