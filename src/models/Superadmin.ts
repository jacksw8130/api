import * as mongoose from 'mongoose';
import { model } from 'mongoose';
import { Utils } from '../utils/Utils';

const SuperadminSchema = new mongoose.Schema({
    name                     : {type: String, required: true},
    code                     : {type: String, required: true},
    password                 : {type: String, required: true},
    wallet                   : {type: Number, required: true, default: 0},
    status                   : {type: Boolean, required: true, default: true},
    created_at               : {type: Date, required: true, default: Utils.indianTimeZone},
    updated_at               : {type: Date, required: true, default: Utils.indianTimeZone},
},{ id : false });

export default model('super_admins', SuperadminSchema);
