import * as mongoose from 'mongoose';
import { model } from 'mongoose';
import { Utils } from '../utils/Utils';

const PartySchema = new mongoose.Schema({
    state_id                 : {type: mongoose.Types.ObjectId, ref: 'states', required: true},
    name                     : {type: String, required: true},
    seats                    : {type: Number, required: false},
    winning_seats            : {type: Number, required: false},
    result_declare_status    : {type: Boolean, required: true, default: false},
    status                   : {type: Boolean, required: true, default: true},
    created_at               : {type: Date, required: true, default: Utils.indianTimeZone},
    updated_at               : {type: Date, required: true, default: Utils.indianTimeZone},
},{ id : false });

PartySchema.set('toObject', { virtuals: true });
PartySchema.set('toJSON', { virtuals: true });

// Ticket COUNT
PartySchema.virtual('ticket_count', {   
    ref: 'tickets', 
    localField: '_id',
    foreignField: 'party_id',
    count: true
});

// Total Ticket Amount
PartySchema.virtual('tickets', {   
    ref: 'tickets', 
    localField: '_id',
    foreignField: 'party_id'
});

export default model('parties', PartySchema);

