"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const Utils_1 = require("../utils/Utils");
const BidSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
    ticket_id: { type: mongoose.Types.ObjectId, refPath: 'ticket_type', required: true },
    ticket_type: { type: String, enum: ['tickets', 'ticket_candidates'], required: true },
    ticket_data: { type: String, required: true },
    yes_or_no: { type: String, required: true, enum: ['yes', 'no'] },
    seat: { type: Number, required: false },
    winning_percentage: { type: Number, required: false },
    result: { type: Boolean, required: false },
    bid_amount: { type: Number, required: true },
    winning_amount: { type: Number, required: false },
    result_declare_status: { type: Boolean, required: true, default: false },
    bid_status: { type: String, required: true, enum: ['pending', 'loss', 'win'] },
    status: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
    updated_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
}, { id: false });
BidSchema.set('toObject', { virtuals: true });
BidSchema.set('toJSON', { virtuals: true });
exports.default = (0, mongoose_1.model)('bids', BidSchema);
