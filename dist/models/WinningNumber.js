"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const Utils_1 = require("../utils/Utils");
const TicketSchema = new mongoose.Schema({
    owner_id: { type: mongoose.Types.ObjectId, ref: 'owners', required: true },
    category: { type: String, required: false },
    party_id: { type: mongoose.Types.ObjectId, ref: 'partys', required: true },
    ticket: { type: String, required: true },
    bidding_date: { type: Date, required: true },
    result_date: { type: Date, required: true },
    result_date_indian: { type: Date, required: false },
    is_show: { type: Boolean, required: true, default: false },
    status: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
    updated_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
}, { id: false });
TicketSchema.set('toObject', { virtuals: true });
TicketSchema.set('toJSON', { virtuals: true });
exports.default = (0, mongoose_1.model)('tickets', TicketSchema);
