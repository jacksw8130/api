import * as mongoose from 'mongoose';
import { model } from 'mongoose';
import { Utils } from '../utils/Utils';

const CandidateSchema = new mongoose.Schema({
    state_id                 : {type: mongoose.Types.ObjectId, ref: 'states', required: true},
    location_id              : {type: mongoose.Types.ObjectId, ref: 'locations', required: true},
    party_name               : {type: String, required: true, uppercase: true},
    name                     : {type: String, required: true},
    bid_status               : {type: Boolean, required: true, default: true},
    status                   : {type: Boolean, required: true, default: true},
    created_at               : {type: Date, required: true, default: Utils.indianTimeZone},
    updated_at               : {type: Date, required: true, default: Utils.indianTimeZone},
},{ id : false });

CandidateSchema.set('toObject', { virtuals: true });
CandidateSchema.set('toJSON', { virtuals: true });

// Ticket COUNT
CandidateSchema.virtual('ticket_count', {   
    ref: 'tickets', 
    localField: '_id',
    foreignField: 'party_id',
    count: true
});

// Total Ticket Amount
CandidateSchema.virtual('tickets', {   
    ref: 'tickets', 
    localField: '_id',
    foreignField: 'party_id'
});

export default model('candidates', CandidateSchema);

