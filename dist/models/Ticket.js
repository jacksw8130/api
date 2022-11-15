"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const Utils_1 = require("../utils/Utils");
const TicketSchema = new mongoose.Schema({
    name: { type: String, required: true },
    party_id: { type: mongoose.Types.ObjectId, ref: 'parties', required: true },
    yes_seats: { type: Number, required: true },
    yes_winning_percent: { type: Number, required: true },
    yes_result: { type: Boolean, required: false },
    no_seats: { type: Number, required: true },
    no_winning_percent: { type: Number, required: true },
    no_result: { type: Boolean, required: false },
    min_bid: { type: Number, required: true },
    max_bid: { type: Number, required: true },
    result_declare_status: { type: Boolean, required: true, default: false },
    expire: { type: Boolean, required: true, default: false },
    bid_status: { type: Boolean, required: true, default: true },
    status: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
    updated_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
}, { id: false });
TicketSchema.set('toObject', { virtuals: true });
TicketSchema.set('toJSON', { virtuals: true });
// Bid COUNT
TicketSchema.virtual('bid_count', {
    ref: 'bids',
    localField: '_id',
    foreignField: 'ticket_id',
    count: true
});
// Total Bid Amount
TicketSchema.virtual('bids', {
    ref: 'bids',
    localField: '_id',
    foreignField: 'ticket_id'
});
exports.default = (0, mongoose_1.model)('tickets', TicketSchema);
