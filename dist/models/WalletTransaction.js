"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const Utils_1 = require("../utils/Utils");
const WalletTransactionSchema = new mongoose.Schema({
    from_id: { type: mongoose.Types.ObjectId, refPath: 'from', required: false },
    from: { type: String, enum: ['super_admins', 'admins', 'users'], required: false },
    to_id: { type: mongoose.Types.ObjectId, refPath: 'to', required: false },
    to: { type: String, enum: ['super_admins', 'admins', 'users'], required: false },
    mode: { type: String, required: true, enum: ['transfer', 'withdraw', 'winning', 'bidding'] },
    coins: { type: Number, required: true },
    from_balance: { type: Number, required: false },
    to_balance: { type: Number, required: false },
    bid_id: { type: mongoose.Types.ObjectId, ref: 'bids', required: false },
    status: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
    updated_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
}, { id: false });
WalletTransactionSchema.set('toObject', { virtuals: true });
WalletTransactionSchema.set('toJSON', { virtuals: true });
exports.default = (0, mongoose_1.model)('wallet_transactions', WalletTransactionSchema);
