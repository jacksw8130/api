"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const Utils_1 = require("../utils/Utils");
const TicketCandidateSchema = new mongoose.Schema({
    state_id: { type: mongoose.Types.ObjectId, ref: 'states', required: true },
    location_id: { type: mongoose.Types.ObjectId, ref: 'locations', required: true },
    candidate_id: { type: mongoose.Types.ObjectId, ref: 'candidates', required: true },
    yes_winning_percent: { type: Number, required: true },
    yes_result: { type: Boolean, required: false },
    no_winning_percent: { type: Number, required: true },
    no_result: { type: Boolean, required: false },
    min_bid: { type: Number, required: true },
    max_bid: { type: Number, required: true },
    result_declare_status: { type: Boolean, required: true, default: false },
    expire: { type: Boolean, required: true, default: false },
    status: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
    updated_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
}, { id: false });
TicketCandidateSchema.set('toObject', { virtuals: true });
TicketCandidateSchema.set('toJSON', { virtuals: true });
// Bid COUNT
TicketCandidateSchema.virtual('bid_count', {
    ref: 'bids',
    localField: '_id',
    foreignField: 'ticket_id',
    count: true
});
// Total Bid Amount
TicketCandidateSchema.virtual('bids', {
    ref: 'bids',
    localField: '_id',
    foreignField: 'ticket_id'
});
exports.default = (0, mongoose_1.model)('ticket_candidates', TicketCandidateSchema);
