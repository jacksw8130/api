"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const Utils_1 = require("../utils/Utils");
const AdminSchema = new mongoose.Schema({
    super_admin_id: { type: mongoose.Types.ObjectId, ref: 'super_admins', required: false },
    name: { type: String, required: true },
    code: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: String, required: false },
    wallet: { type: Number, required: true, default: 0 },
    bid_status: { type: Boolean, required: true, default: true },
    password_status: { type: Boolean, required: true, default: false },
    status: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
    updated_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
}, { id: false });
AdminSchema.set('toObject', { virtuals: true });
AdminSchema.set('toJSON', { virtuals: true });
// User COUNT
AdminSchema.virtual('user_count', {
    ref: 'users',
    localField: '_id',
    foreignField: 'admin_id',
    count: true
});
exports.default = (0, mongoose_1.model)('admins', AdminSchema);
