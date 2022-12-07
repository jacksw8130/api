import * as mongoose from 'mongoose';
import { model } from 'mongoose';
import { Utils } from '../utils/Utils';

const BidButtonSchema = new mongoose.Schema({
    user_id                  : {type: mongoose.Types.ObjectId, ref: 'users', required: false},
    label                    : {type: String, required: true},
    value                    : {type: Number, required: true},
    status                   : {type: Boolean, required: true, default: true},
    created_at               : {type: Date, required: true, default: Utils.indianTimeZone},
    updated_at               : {type: Date, required: true, default: Utils.indianTimeZone},
},{ id : false });

BidButtonSchema.set('toObject', { virtuals: true });
BidButtonSchema.set('toJSON', { virtuals: true });

export default model('bid_buttons', BidButtonSchema);
