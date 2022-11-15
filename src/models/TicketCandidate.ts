import * as mongoose from 'mongoose';
import { model } from 'mongoose';
import { Utils } from '../utils/Utils';

const TicketCandidateSchema = new mongoose.Schema({
    state_id                 : {type: mongoose.Types.ObjectId, ref: 'states', required: true},
    location_id              : {type: mongoose.Types.ObjectId, ref: 'locations', required: true},
    candidate_id             : {type: mongoose.Types.ObjectId, ref: 'candidates', required: true},
    yes_winning_percent      : {type: Number, required: true},
    yes_result               : {type: Boolean, required: false},
    no_winning_percent       : {type: Number, required: true},
    no_result                : {type: Boolean, required: false},
    min_bid                  : {type: Number, required: true},
    max_bid                  : {type: Number, required: true},
    result_declare_status    : {type: Boolean, required: true, default: false},
    expire                   : {type: Boolean, required: true, default: false},
    status                   : {type: Boolean, required: true, default: true},
    created_at               : {type: Date, required: true, default: Utils.indianTimeZone},
    updated_at               : {type: Date, required: true, default: Utils.indianTimeZone},
},{ id : false });

TicketCandidateSchema.set('toObject', { virtuals: true });
TicketCandidateSchema.set('toJSON', { virtuals: true });

// Bid COUNT
TicketCandidateSchema.virtual('bid_count', {   
    ref: 'bids', 
    localField: '_id',
    foreignField: 'ticket_id',
    count: true
});

// Total Bid Amount
TicketCandidateSchema.virtual('bids', {   
    ref: 'bids', 
    localField: '_id',
    foreignField: 'ticket_id'
});


export default model('ticket_candidates', TicketCandidateSchema);              

