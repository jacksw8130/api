import * as mongoose from 'mongoose';
import { model } from 'mongoose';
import { Utils } from '../utils/Utils';

const AdminSchema = new mongoose.Schema({
    super_admin_id           : {type: mongoose.Types.ObjectId, ref: 'super_admins', required: false},
    name                     : {type: String, required: true},
    code                     : {type: String, required: true},
    password                 : {type: String, required: true},
    location                 : {type: String, required: false},
    wallet                   : {type: Number, required: true, default: 0},
    bid_status               : {type: Boolean, required: true, default: true},
    password_status             : {type: Boolean, required: true, default: false},
    status                   : {type: Boolean, required: true, default: true},
    created_at               : {type: Date, required: true, default: Utils.indianTimeZone},
    updated_at               : {type: Date, required: true, default: Utils.indianTimeZone},
},{ id : false });

AdminSchema.set('toObject', { virtuals: true });
AdminSchema.set('toJSON', { virtuals: true });

// User COUNT
AdminSchema.virtual('user_count', {   
    ref: 'users', 
    localField: '_id',
    foreignField: 'admin_id',
    count: true
});


export default model('admins', AdminSchema);
