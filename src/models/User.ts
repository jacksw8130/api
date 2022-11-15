import * as mongoose from 'mongoose';
import { model } from 'mongoose';
import { Utils } from '../utils/Utils';

const userSchema = new mongoose.Schema({
    admin_id                    : {type: mongoose.Types.ObjectId, ref: 'admins', required: true},
    name                        : {type: String, required: true},
    code                        : {type: String, required: true},
    password                    : {type: String, required: true},
    location                    : {type: String, required: false},
    wallet                      : {type: Number, required: true, default: 0},
    balance                     : {type: Number, required: true, default: 0},
    bid_status                  : {type: Boolean, required: true, default: true},
    password_status             : {type: Boolean, required: true, default: false},
    status                      : {type: Boolean, required: true, default: true},
    created_at                  : {type: Date, required: true, default: Utils.indianTimeZone},
    updated_at                  : {type: Date, required: true, default: Utils.indianTimeZone},
},{ id : false });

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

export default model('users', userSchema);

