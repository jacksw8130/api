import * as mongoose from 'mongoose';
import { model } from 'mongoose';
import { Utils } from '../utils/Utils';

const WalletTransactionSchema = new mongoose.Schema({
    from_id              : {type: mongoose.Types.ObjectId, refPath: 'from', required: false},
    from                 : {type: String, enum: ['super_admins','admins','users'], required: false},
    to_id                : {type: mongoose.Types.ObjectId, refPath: 'to', required: false},
    to                   : {type: String, enum: ['super_admins','admins','users'], required: false},
    mode                 : {type: String, required: true, enum:['transfer','withdraw','winning','bidding']},
    coins                : {type: Number, required: true},
    from_balance         : {type: Number, required: false},
    to_balance           : {type: Number, required: false},
    bid_id               : {type: mongoose.Types.ObjectId, ref: 'bids', required: false},
    status               : {type: Boolean, required: true, default: true},
    created_at           : {type: Date, required: true, default: Utils.indianTimeZone},
    updated_at           : {type: Date, required: true, default: Utils.indianTimeZone},
},{ id : false });
    
WalletTransactionSchema.set('toObject', { virtuals: true });
WalletTransactionSchema.set('toJSON', { virtuals: true });

export default model('wallet_transactions', WalletTransactionSchema);

