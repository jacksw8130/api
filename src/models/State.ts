import * as mongoose from 'mongoose';
import { model } from 'mongoose';
import { Utils } from '../utils/Utils';

const StateSchema = new mongoose.Schema({
    name                     : {type: String, required: true},
    bid_status               : {type: Boolean, required: true, default: true},
    status                   : {type: Boolean, required: true, default: true},
    created_at               : {type: Date, required: true, default: Utils.indianTimeZone},
    updated_at               : {type: Date, required: true, default: Utils.indianTimeZone},
},{ id : false });

StateSchema.set('toObject', { virtuals: true });
StateSchema.set('toJSON', { virtuals: true });

export default model('states', StateSchema);

