import * as mongoose from 'mongoose';
import { model } from 'mongoose';
import { Utils } from '../utils/Utils';

const LocationSchema = new mongoose.Schema({
    state_id                 : {type: mongoose.Types.ObjectId, ref: 'states', required: true},
    name                     : {type: String, required: true},
    candidate_winner_id      : {type: mongoose.Types.ObjectId, ref: 'candidates', required: false},
    result_declare_status    : {type: Boolean, required: true, default: false},
    bid_status               : {type: Boolean, required: true, default: true},
    status                   : {type: Boolean, required: true, default: true},
    created_at               : {type: Date, required: true, default: Utils.indianTimeZone},
    updated_at               : {type: Date, required: true, default: Utils.indianTimeZone},
},{ id : false });

LocationSchema.set('toObject', { virtuals: true });
LocationSchema.set('toJSON', { virtuals: true });

// Ticket COUNT
LocationSchema.virtual('ticket_count', {   
    ref: 'tickets', 
    localField: '_id',
    foreignField: 'location_id',
    count: true
});

// Total Ticket Amount
LocationSchema.virtual('tickets', {   
    ref: 'tickets', 
    localField: '_id',
    foreignField: 'location_id'
});

export default model('locations', LocationSchema);

