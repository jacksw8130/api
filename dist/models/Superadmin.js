"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const Utils_1 = require("../utils/Utils");
const SuperadminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    password: { type: String, required: true },
    wallet: { type: Number, required: true, default: 0 },
    status: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
    updated_at: { type: Date, required: true, default: Utils_1.Utils.indianTimeZone },
}, { id: false });
exports.default = (0, mongoose_1.model)('super_admins', SuperadminSchema);
